import { Controller, Get, Query } from '@nestjs/common';
import {ChartService, IChartArguments} from "./chart.service";


@Controller('chart')
export class ChartController {
    constructor(private readonly chartService: ChartService) { }

    @Get()
    async getChart(@Query() chartArguments: IChartArguments) {
        console.log('chartArguments', chartArguments);
        try {
            const base64 = await this.chartService.getBase64(chartArguments);
            return {
                data: base64
            }
        }
        catch (err) {
            return {
                error: err.message || 'Ha ocurrido un problema'
            }
        }
    }
}
