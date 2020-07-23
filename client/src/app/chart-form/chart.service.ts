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
@Injectable({
    providedIn: 'root'
})
export class ChartService {
    constructor(
        private http: HttpClient
    ) {}

    getChart(chartArguments: IChartArguments): Observable<{data: string}> {
        return this.http.post<{data: string}>('api/chart', chartArguments);
    }
}