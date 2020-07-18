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
            chartGenerator.stdout.on('data', data => {
                base64ChartImage += data.toString();
                //console.log('Pipe data from python script ...', data.toString());
            })

            chartGenerator.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
                console.log('result', base64ChartImage);
                resolve(base64ChartImage);
            });

            chartGenerator.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                reject(new Error(`Error durante la ejecución del script: ${data}`));
            });

            chartGenerator.on('error', (err) => {
                console.error('Failed to start subprsocess.');
                console.log(err);
                reject(err);
            });
        })

    }
}