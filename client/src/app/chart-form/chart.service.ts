import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IChartArguments {
    url: string,
    xAxis: string,
    yAxis: string
}
@Injectable({
    providedIn: 'root'
})
export class ChartService {
    constructor(
        private http: HttpClient
    ) {}

    getChart(chartArguments: IChartArguments): Observable<{data: string}> {
        return this.http.get<{data: string}>('/api/chart', {params: chartArguments as any});
    }
}