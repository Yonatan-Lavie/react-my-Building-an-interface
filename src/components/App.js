import React, { Component } from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import { findIndex, without, } from 'lodash';



class App extends Component {
  constructor(){
    super();
    this.state = {
      myName: "Yoni Shavat",
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0,
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.AddAppointment = this.AddAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(name, value, id){
    let tempAtps = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {aptId:id});
    tempAtps[aptIndex][name] = value;
    this.setState({
      myAppointments: tempAtps,
    })
  }

  searchApts(query){
    this.setState({
      queryText: query,
    });
  }
  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir,
    });
  }

  AddAppointment(apt){
    let tempApts = this.state.myAppointments;
    apt.id = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1, 
    })
  }

  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  deleteAppointment(apt){
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts
    })
  }

  componentDidMount() {
    fetch("./data.json")
    .then(response => response.json())
    .then(result => {
      const apts = result.map(item => {
        item.aptId = this.state.lastIndex;
        this.setState({ lastIndex: this.state.lastIndex + 1 });
        return item;
      });
      this.setState({
        myAppointments : apts
      });
    });
  }
  render() {

    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) =>{
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase() ){
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(item => {
      return (
        item['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['aptDate'].toLowerCase().includes(this.state.queryText.toLowerCase())
      )
    });
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments                   
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  AddAppointment={this.AddAppointment}
                  />
                <SearchAppointments 
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <ListAppointments 
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                  />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
