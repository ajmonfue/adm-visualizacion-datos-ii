import { Component } from '@angular/core';
import { ChartService } from './chart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from './data.service';
import * as papaparse from 'papaparse';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
    private readonly base64Prefix: string = 'data:image/png;base64,';

    public chartBase64: string;
    public formData: FormGroup;
    public formArguments: FormGroup;

    public data: any;
    public csvFields: string[] = [];
    constructor(
        private readonly chartService: ChartService,
        private readonly dataService: DataService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.formData = this.fb.group({
            url: [null, Validators.required ]
        })

        this.formArguments = this.fb.group({
            xAxis: [ null, Validators.required ],
            yAxis: [ null, Validators.required ]
        })
    }

    public onFormDataSubmit() {
        const { url } = this.formData.value;
        this.dataService.getFromUrl(url).subscribe(data => {
            const csvData = papaparse.parse(data, {header: true, delimiter: ',', skipEmptyLines: true});
            this.data = csvData;


            this.csvFields = csvData.meta.fields;
        })
    }

    public onArgumentsSubmit() {
        const chartArguments = {
            ...this.formData.value,
            ...this.formArguments.value
        }
        this.chartService.getChart(chartArguments)
            .subscribe(res => {
                this.chartBase64 = `${this.base64Prefix}${res.data}`;
            })
    }
}