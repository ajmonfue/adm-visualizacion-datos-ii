import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

export interface IChartArguments {
    url: string,
    xAxis: string,
    yAxis: string,
    chartType: string
}

@Injectable()
export class ChartService {
    public async getBase64(chartArguments: IChartArguments) {
        return new Promise((resolve, reject) => {
            const chartGenerator = spawn('python3', [
                '../main.py',
                '--base64',
                '--url', chartArguments.url,
                '--x-axis', chartArguments.xAxis,
                '--y-axis', chartArguments.yAxis,
                '--chart-type', chartArguments.chartType,
                ]
            );

            let base64ChartImage = '';
            let errorBuffer = '';

            chartGenerator.stdout.on('data', data => {
                base64ChartImage += data.toString();
            })

            chartGenerator.on('close', (code) => {
                if (code != 0) {
                    return reject(new Error(errorBuffer || 'Error durante la ejecución del script'));
                }
                resolve(base64ChartImage);
            });

            chartGenerator.stderr.on('data', (data) => {
                errorBuffer += data.toString();
            });

            chartGenerator.on('error', (err) => {
                reject(err);
            });
        })

    }
}