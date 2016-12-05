import React, { Component } from 'react'
import moment from 'moment-timezone'

var abbrs = {
  EST : '东部标准时间',
  EDT : '东部夏令时间',
  CST : '中部标准时间',
  CDT : '中部夏令时间',
  MST : '山区标准时间',
  MDT : '山区夏令时间',
  PST : '太平洋标准时间',
  PDT : '太平洋夏令时间'
}

moment.locale('zh-cn');

moment.fn.zoneName = function() {
  var abbr = this.zoneAbbr();
  return abbrs[abbr] || abbr;
}

export class Clock extends Component {
  constructor(props) {
    super(props);

    if (props.tz === undefined) {
      this.tz = moment.tz.guess();
    }
    else {
      this.tz = props.tz;
    }

    this.state = {
      time : moment.tz(this.tz).format("MMMDo ddd HH:mm"),
      zone : moment.tz(this.tz).zoneName()
    };
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState({
      time : moment.tz(this.tz).format("MMMDo ddd HH:mm")
    });
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="ui segment clock">
        <h1 className="ui header">
          {this.state.time}
          <div className="sub header">{this.state.zone}</div>
        </h1>
      </div>
    )
  }
}
