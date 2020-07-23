import { Component, ViewChild, ElementRef } from '@angular/core';
import { IChartData, IChartArguments } from '../chart-form/chart.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
    @ViewChild('chartCanvasRef', { read: ElementRef }) chartCanvasRef: ElementRef<HTMLCanvasElement>;

    private readonly base64Prefix: string = 'data:image/png;base64,';

    public chartBase64: string;

    public data: any;
    public csvFields: string[] = [];

    private chart: Chart;
    private chartContext: CanvasRenderingContext2D;

    ngAfterViewInit() {
        this.chartContext = this.chartCanvasRef.nativeElement.getContext('2d');
    }

    public renderChart({response, chartArguments}: {response: {data: IChartData}, chartArguments: IChartArguments}) {
        this.chartBase64 = `${this.base64Prefix}${response.data.imageBase64}`;

        // Initialize chart with chart.js
        const { chartType, xAxis, yAxis } = chartArguments;

        const { data } = response.data.sourceData;
        
        if (this.chart) {
            this.chart.clear();
            this.chart.destroy();
        }

        this.chart = new Chart(this.chartContext, {
            type: chartType,
            data: {
                labels: xAxis.length > 1 ? xAxis : data.map(d => d[xAxis[0]]),
                datasets: this.getDatasets(data, xAxis, yAxis)
            }
        })        
    }

    private getDatasets(data: any[], xAxis: string[], yAxis: string[]): Chart.ChartDataSets[] {
        if (xAxis.length > 1) {
            const yAxisSingle = yAxis[0];
            const hidden = data.length > 15;
            return data.map(row => {
                const color = this.generateRandomColor();
                return {
                    label: row[yAxisSingle],
                    data: xAxis.map(xa => row[xa]),
                    fill: false,
                    borderColor: color,
                    backgroundColor: color,
                    hidden
                }
            })
        }

        return yAxis.map(yAxi => {
            const color = this.generateRandomColor();

            return {
                label: yAxi,
                data: data.map(d => d[ yAxi ]),
                fill: false,
                borderColor: color,
                backgroundColor: color,
            }
        })
    }

    private generateRandomColor(): string {
        return "#"+((1<<24)*Math.random()|0).toString(16);
    }
}