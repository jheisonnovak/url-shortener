import { Controller, Get, Header, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { MetricsGuard } from "./metrics.guard";
import { MetricsService } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
	constructor(private readonly metricsService: MetricsService) {}

	@Get()
	@ApiOperation({ tags: ["Metrics"], description: "Retrieve application metrics" })
	@UseGuards(MetricsGuard)
	@Header("Content-Type", "text/plain")
	async getMetrics(): Promise<string> {
		return this.metricsService.getMetrics();
	}
}
