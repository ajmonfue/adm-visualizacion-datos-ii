import { Component } from '@angular/core';
import { ChartService, IChartArguments } from './chart.service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
    private readonly base64Prefix: string = 'data:image/png;base64,';

    public chartBase64: string;

    public data: any;
    public csvFields: string[] = [];
    constructor(
        private readonly chartService: ChartService
    ) {}

    public renderChart(chartArguments: IChartArguments) {
        this.chartService.getChart(chartArguments)
            .subscribe(res => {
                this.chartBase64 = `${this.base64Prefix}${res.data}`;
            })
    }
}