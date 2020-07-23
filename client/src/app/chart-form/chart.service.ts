import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IChartArguments {
    url: string,
    xAxis: string | string[],
    yAxis: string | string[],
    dataBase64: {
        filename: string,
        filetype: string
        value: string
    }
}

export interface IChartData {
    imageBase64: string;
    csvData: {
        columns: string[],
        data: any[][],
        index: number[]
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