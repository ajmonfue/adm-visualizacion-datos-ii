import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from "@angular/core";
import { IChartData } from './chart-data.model';

@Component({
    selector: 'app-chart-data',
    templateUrl: './chart-data.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartDataComponent {
    @Input()
    public data: IChartData;

    constructor(private cd: ChangeDetectorRef) {}

    public renderData(data: any) {
        this.data = data;
        this.cd.detectChanges();
    }
}