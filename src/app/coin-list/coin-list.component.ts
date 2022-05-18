import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from './../service/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {

  bannerData: any=[];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private route: Router) { }

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
  }

  getBannerData() {
    this.api.getTrendingCurrency("USD")
    .subscribe(res=> {
      console.log(res);
      this.bannerData = res;
    });
  }

  getAllData(){
    this.api.getCurrencyData("USD")
    .subscribe(res => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gotoDetails(row: any) {
    this.route.navigate(['coin-detail', row.id]);
  }

}
