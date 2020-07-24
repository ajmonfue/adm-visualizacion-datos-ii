import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, Pipe, Directive, HostBinding } from "@angular/core";
import { IChartImportedData } from './chart-data.model';
import { IChartArguments } from '../chart-form/chart.service';

@Directive({
    selector: '[selectedByAxis]'
})
export class SelectedByAxisDirective {
    @Input()
    public selectedByAxis: string;

    @HostBinding('class.x-axis-selected')
    protected xAxisSelected: boolean = false;

    @HostBinding('class.y-axis-selected')
    protected yAxisSelected: boolean = false;
    
    @Input()
    public set chartArguments(chartArguments: IChartArguments) {
        if (chartArguments) {
            this.xAxisSelected = chartArguments.xAxis.some(axisName => axisName == this.selectedByAxis);
            this.yAxisSelected = chartArguments.yAxis.some(axisName => axisName == this.selectedByAxis);
        }
    }
}


@Component({
    selector: 'app-chart-data',
    templateUrl: './chart-data.component.html',
    styleUrls: ['./chart-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartDataComponent {
    @Input()
    public data: IChartImportedData;

    public arguments: IChartArguments;

    @Input()
    public set chartArguments(chartArguments: IChartArguments) {
        this.arguments = chartArguments;
        this.cd.detectChanges();
    }

    constructor(private cd: ChangeDetectorRef) {}

    public renderData(data: any) {
        this.data = data;
        this.chartArguments = null;
        this.cd.detectChanges();
    }
}