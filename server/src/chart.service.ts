import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class ChartService {
    public async getBase64() {
        return new Promise((resolve, reject) => {
            const chartGenerator = spawn('python3', [
                '../main.py',
                '--base64',
                '--url', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-16-2020.csv',
                '--x-axis', 'Country_Region',
                '--y-axis', 'Confirmed']
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