const electron = require('electron')
const ipcMain = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const fs = require('fs')

const transit = require('transit')
const TripPlanner = transit.TripPlanner

const protocol = electron.protocol;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tp = new TripPlanner("Forest Hills", ["E", "F", "R", "M"])

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 480})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.on("train-time-requested", (event, arg) => {
    console.log("train-time-requested");
    tp._getArrivalTrains()
      .then((res) => {
        console.log(res);
        event.sender.send("train-time-received", res);
      })
  })

  ipcMain.on("bg-image-requested", (event) => {
    console.log("bg-image-requested");
    fs.readdir("./background", (err, files) =>{
      let url = files[Math.floor(Math.random() * files.length)];
      url = "background://" + url;
      event.sender.send("bg-image-received", url);
    })
  })
}

protocol.registerStandardSchemes(['background']);

app.on('ready', () => {
  console.log("register protocol");

  protocol.registerFileProtocol('background', (request, callback) => {
    var url = request.url.substr(12);
    url = url.substr(1, url.length - 2);
    console.log("request");
    console.log(url)
    console.log("=> " + path.join(__dirname, 'background', url));
    callback({path: path.join(__dirname, 'background', url)});
  }, (error) => {
    console.error('Register succeed');
    if (error) {
      console.error('Failed to register protocol');
    }
  });

  protocol.isProtocolHandled("background", (error) => {
    console.log(error);
  });

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
