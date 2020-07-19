import { Component } from '@angular/core';
import { ChartService } from './chart.service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
    private readonly base64Prefix: string = 'data:image/png;base64,';

    public chartBase64: string;
    constructor(
        private readonly chartService: ChartService
    ) {}

    ngOnInit() {
        this.chartService.getChart()
            .subscribe(
                res => {
                    this.chartBase64 = `${this.base64Prefix}${res.data}`;
                }
            )
    }
}