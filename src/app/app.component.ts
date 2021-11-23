import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from "ng2-charts";
import {ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aflapp';
  socket: any;
  teams: Array<any> = [];
  message: string = '';
  counter: number = 0;
  newPurchase: number = 0;

  teamName: string = '';
  values: number = 0;
  countPerTeam: number = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = ['Melbourne Demons', 'Port Adelaide', 'Geelong Cats', 'Brisbane Lions', 'Western Bulldogs',
  'Sydney Swans', 'GWS Giants', 'Essendon', 'West Coast', 'St Kilda', 'Fremantle', 'Richmond', 'Carlton','Hawthorn', 'Adelaide',
  'Gold Coast', 'Collingwood', 'North Melbourne'];
  public pieChartData: SingleDataSet = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    // sends a connection request to the server
    this.socket = io(); // connection event
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  // ngOnInit() will be called after all the data binding has been processed by Angular
  ngOnInit() {
    this.getAllTeams();
    this.getCount();
    this.getCounter();
  }

  getCounter() {
    this.socket.on("increaseResult", (data:any) => {
      this.teams = data.newTeam.teams;
      console.log(this.teams)
      // shows the total number of tickets sold so far
      console.log('Counter: ' + data.totalCount)
      this.counter = data.totalCount;
      console.log('counter: ' + this.counter)

      if (this.pieChartData.length == 0) {
        for (let i = 0; i < this.teams.length; i++) {
          this.pieChartData.push(this.teams[i].count)
        }
      } else {
        this.pieChartData = [];
        for (let i = 0; i < this.teams.length; i++) {
          this.pieChartData.push(this.teams[i].count)
        }
      }
    });
  }

  // Listens and receives teams objects from the server
  getAllTeams() {
    this.socket.on("allTeams", (data:any) => {
      console.log('This is the data')
      console.log(data)
      console.log('this is the this.teams')
      this.teams = data.getAllTeams.teams;
      console.log(this.teams)
      // console.log(this.teams[0].text)
      // console.log(this.teams[0].count)
      console.log('this is the text')
      this.message = data.getAllTeams.theText;
      console.log(this.message)
    });
  }

  getCount() {
    this.socket.on('purchaseResult', (data:any) => {
      this.teams = data.newTeam.teams;
      console.log(this.teams)
      // shows the total number of tickets sold so far
      console.log('Counter: ' + data.totalCount)
      this.counter = data.totalCount;
      console.log('counter: ' + this.counter)

      // Extracts the text, teams' names and their counters.
      // Use the chart.js package to plot the results in a graphical way.
      // update the pie chart
      if (this.pieChartData.length == 0) {
        for (let i = 0; i < this.teams.length; i++) {
          this.pieChartData.push(this.teams[i].count)
        }
      } else {
        this.pieChartData = [];
        for (let i = 0; i < this.teams.length; i++) {
          this.pieChartData.push(this.teams[i].count)
        }
      }
    });
  }

  // when you select a team
  onSelectTeam(item: any) {
    this.teamName = item.text;
    console.log(this.teamName)
    this.values = item.value;
    console.log('Value: ' + this.values)
    this.countPerTeam = item.count
    console.log('Count: ' + this.countPerTeam)
  }

  // purchase a ticket from a team
  onPurchaseButton() {
    // Sends the number of the tickets along with the selected team to the backend server using socket.io
    let obj = {
      value: this.values,
      purchaseCount: this.newPurchase
    }
    // to allow the radio button when not selected. reset it
    this.values = 18
    // send a message back to the server
    this.socket.emit('purchaseSender', obj);

    // for (let i = 0; i < this.teams.length; i++) {
    //   if (this.values == this.teams[i].value) {
    //     this.teams[i].count += this.newPurchase;
    //     console.log('matches')
    //     console.log(this.teams[i].text + ' count: ' + this.teams[i].count)
    //   }
    // }
    // console.log(this.teams)
    // this.counter += this.newPurchase;
  }

  increaseCounterByOne() {
    let obj = {
      purchaseCount: 1
    }
    this.socket.emit('increaseSender', obj);
  }

}
