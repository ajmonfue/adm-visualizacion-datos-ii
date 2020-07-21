import { Controller, Post, Body } from '@nestjs/common';
import {ChartService, IChartArguments} from "./chart.service";


@Controller('chart')
export class ChartController {
    constructor(private readonly chartService: ChartService) { }

    @Post()
    async getChart(@Body() chartArguments: IChartArguments) {
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
