import React, { Component } from 'react'
import moment from 'moment'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ServiceStatus from '../modules/service_status'

const ipcRenderer = require( 'electron').ipcRenderer

import '../assets/css/subway.css'


const statusMap = {
  "PLANNED WORK" : "计划维修",
  "GOOD SERVICE" : "正常",
  "DELAYS" : "延误"
}

class TimeTable extends Component {
  constructor(props) {
    super(props);
    this.capacity = props.capacity || 3;
    this.arrivals = [];
    this.status = {};

    this.state = {
      showing : []
    }

    this.ss = new ServiceStatus();

    this.refresh = this.refresh.bind(this);
    this.refreshArrivals = this.refreshArrivals.bind(this);
    this.refreshStatus = this.refreshStatus.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('train-time-received', this.refreshArrivals);
    this.refresh();
    this.timer = setInterval(this.refresh, 10000);
  }

  refresh() {
    let now = moment().format("HH:mm:ss");
    while (this.arrivals[0] != undefined && this.arrivals[0].arrival_time < now) {
      this.arrivals.shift();
    }

    if (this.arrivals.length < this.capacity) {
      ipcRenderer.send('train-time-requested');
      console.log("Arrival info requested.");
      return;
    }

    let showing = [];
    for (let i = 0; i < this.capacity; i++) {
      showing.push(this.arrivals[i]);
    }

    this.setState({
      showing : showing,
    });

    console.log("refresh status");
    this.ss.getSubwayStatus()
      .then((res) => {
        console.log("refresh status");
        this.refreshStatus(res);
      });
  }

  refreshStatus(status) {
    // console.log(status)
    this.status = status;
    this.setState({
      showing : this.state.showing
    });
  }

  refreshArrivals(sender, arrivals) {
    this.arrivals = [];
    console.log(arrivals);
    for (let arrival of arrivals) {
      this.arrivals.push(arrival);
    }
    if (this.arrivals.length > this.capacity) {
      this.refresh();
    }
    else {
      console.error("No enough arrival train infos");
    }
  }


  render() {
    let arrival_widget = [];
    if (this.state.showing.length < this.capacity) {
      return (<h2 className="ui header">少女祈祷中</h2>);
    }
    for (let i = 0; i < this.capacity; i++) {
      let arrival = this.state.showing[i];
      let route_icon = React.createElement('span',
        {
          className: 'mta-bullet mta-' + arrival.route.toLowerCase()
        }, arrival.route);

      let stat = null;

      if (this.status[arrival.route] != undefined) {
        stat = statusMap[this.status[arrival.route].status] || this.status[arrival.route].status;
      }

      let w =
        <div className="ui vertical segment arrival" key={arrival.arrival_time}>
          <h3 className="ui header">
            {route_icon}
            <div className="content">
              {stat}
              <div className="sub header">
                {moment(arrival.arrival_time, "hh:mm:ss").fromNow()}到达
              </div>
            </div>
        </h3>
        </div>;
      arrival_widget.unshift(w);
    }

    return (
      <div className="timetable">
        <ReactCSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}>
        {arrival_widget}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export class Transit extends Component {
  render() {
    return(
      <div className="ui segment">
        <TimeTable />
      </div>
    );
  }
}
