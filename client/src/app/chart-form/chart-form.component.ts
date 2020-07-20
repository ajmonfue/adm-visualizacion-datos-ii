import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as papaparse from 'papaparse';
import { DataService } from './data.service';
import { ChartService } from './chart.service';
import { IChartData } from '../chart-data/chart-data.model';
import { finalize } from 'rxjs/operators';

const CHART_TYPES = [
    {
        key: 'line',
        label: 'Líneas'
    },
    {
        key: 'bar',
        label: 'Barras'
    },
    {
        key: 'point',
        label: 'Puntos'
    }
];

@Component({
    selector: 'app-chart-form',
    templateUrl: './chart-form.component.html'
})
export class ChartFormComponent {
    public formData: FormGroup;
    public formArguments: FormGroup;

    public data: any;
    public csvFields: string[] = [];

    public loadingData: boolean = false;
    public loadingChart: boolean = false;
    public chartTypes = CHART_TYPES;

    @Output()
    public getChart: EventEmitter<any> = new EventEmitter();

    @Output()
    public getData: EventEmitter<IChartData> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private readonly dataService: DataService,
        private readonly chartService: ChartService
    ) {}

    ngOnInit() {
        this.formData = this.fb.group({
            url: [null, Validators.required ]
        })

        this.formArguments = this.fb.group({
            xAxis: [ null, Validators.required ],
            yAxis: [ null, Validators.required ],
            chartType: [ 'line', Validators.required ]
        })
    }

    public onFormDataSubmit() {
        const { url } = this.formData.value;

        this.loadingData = true;
        this.dataService.getFromUrl(url)
            .pipe(
                finalize(() => {
                    this.loadingData = false;
                })
            )
            .subscribe(data => {
                const csvData = papaparse.parse(data, {header: true, delimiter: ',', skipEmptyLines: true});
                this.data = csvData;
                this.csvFields = csvData.meta.fields;

                this.getData.emit({
                    headers: this.csvFields,
                    rows: csvData.data as any
                });
                
            });
        
    }

    public onArgumentsSubmit() {
        const chartArguments = {
            ...this.formData.value,
            ...this.formArguments.value
        }
        this.loadingChart = true;

        this.chartService.getChart(chartArguments)
            .pipe(
                finalize(() => {
                    this.loadingChart = false;
                })
            )
            .subscribe(res => {
                this.getChart.emit(res);
            })

        
    }
}