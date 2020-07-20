import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [ChartController],
  providers: [ChartService],
})
export class AppModule {}
