import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  coinData: any;
  coinId !: string;
  days: number = 30;
  currency: string = "USD";
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: `Price Trends`,
      backgroundColor: 'rgba(39, 148, 245, 0.8)',
      borderColor: '#009688',
      pointBackgroundColor: '#009688',
      pointBorderColor: '#009688',
      pointHoverBackgroundColor: '#009688',
      pointHoverBorderColor: '#009688'
    }],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: { display: true }
    }
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

  constructor(private api: ApiService, private activateRoute: ActivatedRoute, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(val => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency()
    .subscribe(val => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    });
  }

  getCoinData() {
    this.api.getCurrencyById(this.coinId)
    .subscribe(res => {
      console.log(res);
      if(this.currency === "BRL") {
        res.market_data.current_price.usd = res.market_data.current_price.brl;
        res.market_data.market_cap.usd = res.market_data.market_cap.brl;
      }
      res.market_data.current_price.usd = res.market_data.current_price.usd;
      res.market_data.market_cap.usd = res.market_data.market_cap.usd;
      this.coinData = res;
    })
  }

  getGraphData(days: number) {
    this.days = days
    this.api.getGraphicalCurrencyData(this.coinId, this.currency, this.days)
    .subscribe(res => {
      setTimeout(() => {
        this.myLineChart?.update()
      }, 200);
      this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
        return a[1];
      });
      this.lineChartData.labels = res.prices.map((a: any) => {
        let date = new Date(a[0]);
        let time = date.getHours() > 12 ? `${date.getHours() - 12} : ${date.getMinutes()} PM` :
        `${date.getHours() - 12} : ${date.getMinutes()} AM`
        return this.days === 1 ? time : date.toLocaleDateString();
      });
    });
  }

}
