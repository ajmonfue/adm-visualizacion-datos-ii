import { IChartArguments, IChartData } from "../chart-form/chart.service";
import * as Chart from 'chart.js';

export abstract class ADMChart {
    protected abstract readonly type: string;

    constructor(
        public context: CanvasRenderingContext2D,
        public chartArguments: IChartArguments,
        public chartData: IChartData) { }

    public build() {
        const { chartType, xAxis, yAxis } = this.chartArguments;
        const { data } = this.chartData.sourceData;

        return new Chart(this.context, {
            type: chartType,
            data: {
                labels: xAxis.length > 1 ? xAxis : data.map(d => d[xAxis[0]]),
                datasets: this.getDatasets(data, xAxis, yAxis)
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        })
    }

    protected getDatasets(data: any[], xAxis: string[], yAxis: string[]): Chart.ChartDataSets[] {
        if (xAxis.length > 1) {
            const yAxisSingle = yAxis[0];
            return data.map((row, index) => {
                const color = this.generateRandomColor();
                return {
                    label: row[yAxisSingle],
                    data: xAxis.map(xa => row[xa]),
                    fill: false,
                    borderColor: color,
                    backgroundColor: color,
                    hidden: index >= 5
                }
            })
        }

        return yAxis.map(yAxi => {
            const color = this.generateRandomColor();

            return {
                label: yAxi,
                data: data.map(d => d[yAxi]),
                fill: false,
                borderColor: color,
                backgroundColor: color,
            }
        })
    }

    private generateRandomColor(): string {
        return "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }
}

export class LineChart extends ADMChart {
    protected readonly type = 'line';
}
export class BarChart extends ADMChart {
    protected readonly type = 'bar';
}

export class ScatterChart extends ADMChart {
    protected readonly type = 'scatter';

    public build() {
        const { xAxis, yAxis } = this.chartArguments;
        const xAxisName = xAxis[0];
        const yAxisName = yAxis[0];

        const { data } = this.chartData.sourceData;

        return new Chart(this.context, {
            type: this.type,
            data: {
                datasets: [
                    {
                        label: `${xAxisName} - ${yAxisName}`,
                        data: data.map(row => {
                            return {
                                x: row[xAxisName],
                                y: row[yAxisName]
                            }
                        })
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: xAxisName
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: yAxisName
                        }
                    }],
                }
            }
        })
    }
}

export const ChartConstructors = {
    'line': LineChart,
    'bar': BarChart,
    'scatter': ScatterChart
}
