var API_KEY = "7e15d62a4c636733";
var WEATHER_QUERY_URL = "http://api.wunderground.com/api/" + API_KEY + "/METHOD/lang:TW/q/KEYWORD.json"

var TEST_QUERY_URL = "http://localhost:8000/t.json";
WEATHER_QUERY_URL = WEATHER_QUERY_URL;

export default class WeatherFetcher {
  constructor(keyword) {
    this.query = WEATHER_QUERY_URL.replace("KEYWORD", keyword);
  }

  parse(data) {
    let result = data.current_observation;

    // console.log(result)

    return {
      temp : result.temp_c,
      feel_temp : result.feelslike_c,
      weather : result.weather,
      wind : result.wind_kph,
      precip_1hr : parseFloat(result.precip_1hr_metric),
      precip_today : parseFloat(result.precip_today_metric),
      icon_img : result.icon_url,
      icon : result.icon
    };
  }

  parseHourly(data) {
    let result = data.hourly_forecast;
    let ret = [];
    result.forEach(function(hf) {
      ret.push({
        hour : hf.FCTTIME.hour,
        temp : parseInt(hf.temp.metric),
        weather : hf.condition,
        icon_img : hf.icon_url,
        qpf : parseFloat(hf.qpf.metric)
      });
    });

    return ret;
  }

  getQueryURL(method) {
    // console.log(this.query.replace("METHOD", method));
    return this.query.replace("METHOD", method);
  }

  fetch(callback) {
    var self = this;
    fetch(this.getQueryURL("conditions"))
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        callback(self.parse(data));
      });
  }

  fetchHourly(callback) {
    var self = this;
    fetch(this.getQueryURL("hourly"))
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        callback(self.parseHourly(data));
      });
  }
}
