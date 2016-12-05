require('./assets/css/app.css')

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Clock } from './components/clock.jsx'
import { Weather } from './components/weather.jsx'
import { Transit } from './components/transit.jsx'

const ipcRenderer = require('electron').ipcRenderer

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokoto : ""
    };
    this.bg = "";
    this.refres = this.refresh.bind(this);
    this.refreshBackground = this.refreshBackground.bind(this);
    this.refreshHitokoto = this.refreshHitokoto.bind(this);
    ipcRenderer.on("bg-image-received", this.refreshBackground);
  }

  refresh() {
    this.refreshHitokoto();
    ipcRenderer.send("bg-image-requested");
  }

  refreshBackground(sender, url) {
    this.bg = url;
    console.log(this.bg);
    this.forceUpdate();
  }

  refreshHitokoto() {
   var self = this;
    fetch("https://api.kotori.love/hitokoto/json.php")
      .then(function(res) {
        return res.json();
      })
      .then(function(res) {
        self.setState({
          hitokoto : res.result.hitokoto
        });
      });
  }

  componentDidMount() {
    this.refresh();
    this.timer = setInterval(this.refresh, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getHitokoto(data) {
    this.setState({
      hitokoto : data
    });
  }

  render() {
    const appStyle = {
      backgroundImage: `url(${this.bg})`,
      backgroundSize: "cover"
    }

    console.log(appStyle.backgoundImage)

    return (
      <div className="App" style={appStyle}>
        <div className="ui fixed inverted menu">
          <div className="ui container">
            <a href="#" className="header item">
              Project chiyo
            </a>
            <div className="right menu">
              <a className="ui item">{this.state.hitokoto}</a>
            </div>
          </div>
        </div>
        <div className="top ui grid container">
          <div className="column">
            <Clock />
          </div>
        </div>
        <div className="bottom ui grid container">
          <div className="eight wide column">
            <Weather />
          </div>
          <div className="eight wide column">
            <Transit />
          </div>
        </div>
      </div>
    );
  }
}


render(
  <App />,
  document.getElementById('app')
);

console.log('Proejct chiyo');
