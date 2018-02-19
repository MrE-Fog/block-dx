import { Component, OnInit, NgZone, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { AppService } from './app.service';
import { OrderbookService } from './orderbook.service';
import { Currentprice } from './currentprice';
import { CurrentpriceService } from './currentprice.service';

declare var AmCharts;

@Component({
  selector: 'depth',
  templateUrl: './depth.component.html',
  styleUrls: ['./depth.component.scss'],
})
export class DepthComponent {
  public symbols:string[];
  public currentPrice: Currentprice;
  public chart: any;

  constructor(
    private zone: NgZone,
    private appService: AppService,
    private currentpriceService: CurrentpriceService,
    private decimalPipe:DecimalPipe
  ) {}

  ngOnInit() {
    this.appService.marketPairChanges.subscribe((symbols) => {
      this.symbols = symbols;
    });
    this.currentpriceService.currentprice.subscribe((cp) => {
      this.currentPrice = cp;
    });
  }

  ngAfterViewInit() {
    this.runDepthChart();
  }

  ngOnChanges() {
    this.runDepthChart();
  }

  runDepthChart(): void {
    // this.zone.runOutsideAngular(() => {
    //   this.chart = AmCharts.makeChart('chartdiv', {
    //     'responsive': {
    //       'enabled': true
    //     },
    //     'type': 'serial',
    //     'theme': 'dark',
    //     'dataLoader': {
    //       'url': '/assets/api/orderbook' + this.symbols.join('_') + '.json',
    //       'format': 'json',
    //       'reload': 3000000000,
    //       'postProcess': function(data) {
    //
    //         // Function to process (sort and calculate cummulative volume)
    //         function processData(list, type, desc) {
    //
    //           // Convert to data points
    //           for(var i = 0; i < list.length; i++) {
    //             list[i] = {
    //               value: Number(list[i][0]),
    //               volume: Number(list[i][1]),
    //             }
    //           }
    //
    //           // Sort list just in case
    //           list.sort(function(a, b) {
    //             if (a.value > b.value) {
    //               return 1;
    //             }
    //             else if (a.value < b.value) {
    //               return -1;
    //             }
    //             else {
    //               return 0;
    //             }
    //           });
    //
    //           // Calculate cummulative volume
    //           if (desc) {
    //             for(var i = list.length - 1; i >= 0; i--) {
    //               if (i < (list.length - 1)) {
    //                 list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
    //               }
    //               else {
    //                 list[i].totalvolume = list[i].volume;
    //               }
    //               var dp = {};
    //               dp['value'] = list[i].value;
    //               dp[type + 'volume'] = list[i].volume;
    //               dp[type + 'totalvolume'] = list[i].totalvolume;
    //               res.unshift(dp);
    //             }
    //           }
    //           else {
    //             for(var i = 0; i < list.length; i++) {
    //               if (i > 0) {
    //                 list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
    //               }
    //               else {
    //                 list[i].totalvolume = list[i].volume;
    //               }
    //               var dp = {};
    //               dp['value'] = list[i].value;
    //               dp[type + 'volume'] = list[i].volume;
    //               dp[type + 'totalvolume'] = list[i].totalvolume;
    //               res.push(dp);
    //             }
    //           }
    //
    //         }
    //
    //         // Init
    //         var res = [];
    //         processData(data.bids, 'bids', true);
    //         processData(data.asks, 'asks', false);
    //
    //         //console.log(res);
    //         return res;
    //       }
    //     },
    //     'graphs': [{
    //       'id': 'bids',
    //       'fillAlphas': 0.1,
    //       'lineAlpha': 1,
    //       'lineThickness': 2,
    //       'lineColor': '#4BF5C6',
    //       'type': 'step',
    //       'valueField': 'bidstotalvolume',
    //       'balloonFunction': balloon
    //     }, {
    //       'id': 'asks',
    //       'fillAlphas': 0.1,
    //       'lineAlpha': 1,
    //       'lineThickness': 2,
    //       'lineColor': '#FF7E70',
    //       'type': 'step',
    //       'valueField': 'askstotalvolume',
    //       'balloonFunction': balloon
    //     },
    //      {
    //       'lineAlpha': 0,
    //       'fillAlphas': 0.2,
    //       'lineColor': '#FFF',
    //       'type': 'column',
    //       'clustered': false,
    //       'valueField': 'bidsvolume',
    //       'showBalloon': false
    //     }, {
    //       'lineAlpha': 0,
    //       'fillAlphas': 0.2,
    //       'lineColor': '#FFF',
    //       'type': 'column',
    //       'clustered': false,
    //       'valueField': 'asksvolume',
    //       'showBalloon': false
    //     }
    //   ],
    //     'categoryField': 'value',
    //     'chartCursor': {},
    //     'balloon': {
    //       'textAlign': 'left',
    //       'disableMouseEvents': true,
    //       'fixedPosition': false,
    //       'fillAlpha': 1
    //     },
    //     'valueAxes': [{
    //       'showFirstLabel': false,
    //       'showLastLabel': false,
    //       'inside': true,
    //       'gridAlpha': 0
    //     }],
    //     'categoryAxis': {
    //       'gridAlpha': 0,
    //       'minVerticalGap': 100,
    //       'startOnAxis': true,
    //       'showFirstLabel': false,
    //       'showLastLabel': false,
    //       'inside': true,
    //       'balloon': {
    //         'fontSize': 0,
    //         'color': '#FFFFFF'
    //         // 'enabled' : false  // TODO: This isn't working for some reason.
    //       }
    //     },
    //     'mouseWheelZoomEnabled': true,
    //     'rotate': true,
    //     'export': {
    //       'enabled': false
    //     },
    //     'listeners': [{
    //       'event': 'rendered',
    //       'method': function(event) {
    //         // var chart = event.chart;
    //         // var chartCursor = new AmCharts.ChartCursor();
    //         // chart.addChartCursor(chartCursor);
    //         // chartCursor.enabled=false;
    //       }
    //     }]
    //   });
    //
    //   // console.log(this.chart);
    //
    //   function balloon(item, graph) {
    //     var txt;
    //     if (graph.id == 'asks') {
    //       txt = 'Ask: <strong>' + formatNumber(item.dataContext.value, graph.chart, 4) + '</strong><br />'
    //         + 'Total volume: <strong>' + formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + '</strong><br />'
    //         + 'Volume: <strong>' + formatNumber(item.dataContext.asksvolume, graph.chart, 4) + '</strong>';
    //     }
    //     else {
    //       txt = 'Bid: <strong>' + formatNumber(item.dataContext.value, graph.chart, 4) + '</strong><br />'
    //         + 'Total volume: <strong>' + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + '</strong><br />'
    //         + 'Volume: <strong>' + formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + '</strong>';
    //     }
    //     return txt;
    //   }
    //
    //   function formatNumber(val, chart, precision) {
    //     return AmCharts.formatNumber(
    //       val,
    //       {
    //         precision: precision ? precision : chart.precision,
    //         decimalSeparator: chart.decimalSeparator,
    //         thousandsSeparator: chart.thousandsSeparator
    //       }
    //     );
    //   }
    // });

  }

}
