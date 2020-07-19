import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as papaparse from 'papaparse';
import { DataService } from './data.service';
import { IChartArguments } from '../chart/chart.service';
import { IChartData } from '../chart-data/chart-data.model';

@Component({
    selector: 'app-chart-form',
    templateUrl: './chart-form.component.html'
})
export class ChartFormComponent {
    public formData: FormGroup;
    public formArguments: FormGroup;

    public data: any;
    public csvFields: string[] = [];

    @Output()
    public submitArguments: EventEmitter<IChartArguments> = new EventEmitter();

    @Output()
    public getData: EventEmitter<IChartData> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private readonly dataService: DataService
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

            this.getData.emit({
                headers: this.csvFields,
                rows: csvData.data as any
            });
            
        })
        
    }

    public onArgumentsSubmit() {
        const chartArguments = {
            ...this.formData.value,
            ...this.formArguments.value
        }

        this.submitArguments.emit(chartArguments);
    }
}