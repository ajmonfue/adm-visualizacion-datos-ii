import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { ConfigService } from '@nestjs/config';

export interface IChartArguments {
    url: string,
    xAxis: string | string[],
    yAxis: string | string[],
    chartType: string,
    dataBase64: {
        filename: string,
        filetype: string
        value: string
    }
}

const UTF_8 = 'utf-8';

@Injectable()
export class ChartService {
    constructor(
        private readonly configService: ConfigService
    ) {}

    public async getChart(chartArguments: IChartArguments) {
        return new Promise((resolve, reject) => {
            const chartGenerator = spawn(this.configService.get('PYTHON_COMMAND') || 'python3', [
                    this.configService.get('SCRIPT_PATH'),
                    '--as-json',
                    '--x-axis', Array.isArray(chartArguments.xAxis) ? chartArguments.xAxis.join(',') : chartArguments.xAxis,
                    '--y-axis', Array.isArray(chartArguments.yAxis) ? chartArguments.yAxis.join(',') : chartArguments.yAxis,
                    '--chart-type', chartArguments.chartType,
                    ...(chartArguments.url ? ['--url', chartArguments.url] : [])
                ]
            );

            if (chartArguments.dataBase64) {
                const buffer = Buffer.from(chartArguments.dataBase64.value, 'base64');
                chartGenerator.stdin.setDefaultEncoding(UTF_8)
                chartGenerator.stdin.write(buffer.toString(UTF_8));
                chartGenerator.stdin.end();
            }

            let dataResultBuffer = '';
            let errorBuffer = '';

            chartGenerator.stdout.on('data', data => {
                dataResultBuffer += data.toString();
            })

            chartGenerator.on('close', (code) => {
                if (code != 0) {
                    return reject(new Error(errorBuffer || 'Error durante la ejecución del script'));
                }
                try {
                    const dataResult: {imageBase64: string, csvData: { columns: string[], data: any[][], index: number[] }} = JSON.parse(dataResultBuffer)
                    resolve(dataResult);
                }
                catch(err) {
                    reject(err)
                }
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