import { Global, Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

@Global()
@Module({
	providers: [MetricsService],
	controllers: [MetricsController],
	exports: [MetricsService],
})
export class MetricsModule {}
