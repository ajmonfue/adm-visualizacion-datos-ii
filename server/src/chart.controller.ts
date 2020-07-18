import { Controller, Get } from '@nestjs/common';
import {ChartService} from "./chart.service";


@Controller('chart')
export class ChartController {
    constructor(private readonly chartService: ChartService) { }

    @Get()
    async getChart() {
        try {
            const base64 = await this.chartService.getBase64();
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
