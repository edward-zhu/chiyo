import xml2js from 'xml2js'

let routeMap = {
  'A' : 'ACE', 'B' : 'BDFM',
  'C' : 'ACE', 'D' : 'BDFM',
  'E' : 'ACE', 'F' : 'BDFM',
  'G' : 'G',
  'J' : 'JZ',
  'L' : 'L',
  'M' : 'BDFM',
  'N' : 'NQR', 'Q' : 'NQR', 'R' : 'NQR',
  'S' : 'S',
  'SIR' : 'SIR',
  'T' : 'T',
  'W' : 'NQR',
  'Z' : 'JZ',
  '1' : '123', '2' : '123', '3' : '123',
  '4' : '456', '5' : '456', '6' : '456',
  '7' : '7'
}

const REFRESH_INTERVAL = 60;
const FEED = "http://web.mta.info/status/serviceStatus.txt";

export default class ServiceStatus {
  constructor() {
    this._stat = null;
    this.timestamp = 0;
  }

  getAllStatus() {
    let self = this;
    let parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      if (Date.now() - this.timestmp < REFRESH_INTERVAL) {
        resolve(self._stat);
      }
      fetch(FEED)
        .then(function(res) {
          return res.text();
        })
        .then(function(data) {
          // console.log(data);
          parser.parseString(data, (err, result) => {
            if (err != null) {
              reject(err);
              return;
            }
            self._stat = result;
            self.timestamp = Date.parse(result.service.timestamp);
            resolve(result);
          });
        });
    });
  }

  _parseSubwayStatus(raw) {
    let lineStatus = {};
    for (let line of raw[0].line) {
      lineStatus[line.name[0]] = {
        "status" : line.status[0],
        "text" : line["text"][0]
      }
    }

    let routeStatus = {};
    for(let route in routeMap) {
      routeStatus[route] = lineStatus[routeMap[route]]
    }

    return routeStatus;
  }

  getSubwayStatus() {
    return new Promise((resolve, reject) => {
      this.getAllStatus()
        .then((all_stat) => {
          resolve(this._parseSubwayStatus(all_stat.service.subway));
        })
    })
  }
}
