import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IChartArguments {
    chartType: string,
    url: string,
    xAxis: string[],
    yAxis: string[],
    dataBase64: {
        filename: string,
        filetype: string
        value: string
    }
}

export interface IChartData {
    imageBase64: string;
    sourceData: {
        data: {[key: string]: any}[],
        schema: {
            fields: string[],
            pandas_version: string,
            primaryKey: string[]
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    constructor(
        private http: HttpClient
    ) {}

    getChart(chartArguments: IChartArguments): Observable<{data: IChartData}> {
        return this.http.post<{data: IChartData}>('api/chart', chartArguments);
    }
}