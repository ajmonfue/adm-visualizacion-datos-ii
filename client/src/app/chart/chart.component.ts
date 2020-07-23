import { Component } from '@angular/core';
import { IChartData } from '../chart-form/chart.service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
    private readonly base64Prefix: string = 'data:image/png;base64,';

    public chartBase64: string;

    public data: any;
    public csvFields: string[] = [];

    public renderChart(chartData: {data: IChartData}) {
        this.chartBase64 = `${this.base64Prefix}${chartData.data.imageBase64}`;
    }
}