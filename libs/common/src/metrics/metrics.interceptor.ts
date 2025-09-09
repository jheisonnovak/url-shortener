import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MetricsService } from "./metrics.service";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
	constructor(
		private readonly metricsService: MetricsService,
		private readonly serviceName: string
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const { method, route } = request;
		const startTime = Date.now();

		this.metricsService.incrementCurrentRequests(this.serviceName);

		return next.handle().pipe(
			tap({
				next: () => {
					this.recordMetrics(method, route?.path || request.url, response.statusCode, startTime);
				},
				error: error => {
					const statusCode = error.status || 500;
					this.recordMetrics(method, route?.path || request.url, statusCode, startTime);
				},
			})
		);
	}

	private recordMetrics(method: string, route: string, statusCode: number, startTime: number): void {
		const duration = (Date.now() - startTime) / 1000;

		this.metricsService.recordHttpRequest(method, route, statusCode, duration, this.serviceName);

		this.metricsService.decrementCurrentRequests(this.serviceName);
	}
}
