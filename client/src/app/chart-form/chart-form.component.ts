import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as papaparse from 'papaparse';
import { DataService } from './data.service';
import { ChartService } from './chart.service';
import { IChartData } from '../chart-data/chart-data.model';
import { finalize } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

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
        key: 'scatter',
        label: 'Dispersión'
    }
];

@Component({
    selector: 'app-chart-form',
    templateUrl: './chart-form.component.html',
    styleUrls: ['./chart-form.component.scss']
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

    @Output()
    public argumentsChange: EventEmitter<any> = new EventEmitter();

    private formArgumentsInitialValues: any;

    constructor(
        private fb: FormBuilder,
        private readonly dataService: DataService,
        private readonly chartService: ChartService,
        private readonly toastrService: NbToastrService
    ) {}

    ngOnInit() {
        this.formData = this.fb.group({
            url: [null, Validators.required ],
            dataBase64: [ null ]
        })

        this.formArguments = this.fb.group({
            xAxis: [ [], Validators.required ],
            yAxis: [ [], Validators.required ],
            chartType: [ 'line', Validators.required ]
        });

        this.formArgumentsInitialValues = this.formArguments.value;

        this.formArguments.valueChanges.subscribe(values => {
            this.argumentsChange.emit(values);
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
            .subscribe(
                data => {
                    this.parseData(data);
                    this.formData.get('dataBase64').setValue(null);
                },
                err => {
                    this.toastrService.show(err.message || 'Error desconocido', 'Error al obtener los datos', {status: 'danger', duration: 4000, destroyByClick: true})
                }
            );
        
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
            .subscribe(
                res => {
                    this.getChart.emit({
                        response: res,
                        chartArguments: chartArguments
                    });
                },
                (err: {error: string, message: string, statusCode: number}) => {
                    console.log('Error:', err.message);
                    this.toastrService.show(err.message || 'Error desconocido', 'Error al obtener el gráfico', {status: 'danger', duration: 4000, destroyByClick: true})
                }
            )

        
    }

    public onFileChange(event) {
        if (!(event.target.files && event.target.files.length > 0)) return;
        const readerText = new FileReader();
        const readerCsv = new FileReader();
        const file = event.target.files[0];

        readerText.readAsText(file);
        readerCsv.readAsDataURL(file);

        readerText.onload = () => {  
            const data = readerText.result;
            this.parseData(data.toString());
        }; 

        readerCsv.onload = () => {
            const base64 = readerCsv.result.toString().split(',')[1];
            this.formData.get('dataBase64').setValue({
                filename: file.name,
                filetype: file.type,
                value: base64
            });
            this.formData.get('url').setValue(null);
        };
    }

    private parseData(data: string) {
        const csvData = papaparse.parse(data, {header: true, delimiter: ',', skipEmptyLines: true});
        this.data = csvData;
        this.csvFields = csvData.meta.fields;

        this.formArguments.reset(this.formArgumentsInitialValues);
        this.getData.emit({
            headers: this.csvFields,
            rows: csvData.data as any
        });
    }
}