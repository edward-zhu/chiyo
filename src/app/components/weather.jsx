import React, { Component } from 'react'
import WeatherFetcher from '../modules/weatherFetcher.js'

class HourlyForecast extends Component {
  constructor(props) {
    super(props);
    this.weather = props.weather;
  }

  render() {
    return(
      <div className="ui basic segment hourly">
        <h4>{this.weather.hour} 时</h4>
        <img src={this.weather.icon_img} />
        <h3>{this.weather.temp}°C</h3>
      </div>
    );
  }
}

export class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather : null,
      forecasts : null
    };
    this.fetcher = new WeatherFetcher('NY/11375');
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    var self = this;
    this.fetcher.fetch(function(data) {
      self.setState({
        weather : data
      });
    });
    this.fetcher.fetchHourly(function(data) {
      self.setState({
        forecasts : data
      });
    });
  }

  render() {
    if (this.state.weather == null) {
      return (
        <div className="ui segment weather">
          <h2 className="ui header">
            <div className="content">
              少女祈祷中...
              <div className="sub header">Loading </div>
            </div>
          </h2>
        </div>
      )
    }

    let precip_1hr_tag = null;

    if (this.state.weather.precip_1hr > 0.1) {
      precip_1hr_tag = <div className="ui tiny blue horizontal label">下雨</div>;
    }

    let forecasts = [];

    if (this.state.forecasts != null) {
      for (let i = 0; i < 5; i++) {
        forecasts.push(<HourlyForecast weather={this.state.forecasts[i]} key={i}/>);
      }
    }

    return (
      <div className="ui segment weather">
        <h2 className="ui header">
          <img src={this.state.weather.icon_img} />
          <div className="content">
            {this.state.weather.weather} / {this.state.weather.temp} °C
            <div className="sub header">
              风速：{this.state.weather.wind} km/h {precip_1hr_tag}
            </div>
          </div>
        </h2>
        <div className="ui horizontal segments">
          {forecasts}
        </div>
      </div>
    );
  }
}
