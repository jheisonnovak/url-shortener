import { Injectable } from "@nestjs/common";
import { collectDefaultMetrics, Counter, Gauge, Histogram, register } from "prom-client";

@Injectable()
export class MetricsService {
	private readonly httpRequestDuration: Histogram<string>;
	private readonly httpRequestsTotal: Counter<string>;
	private readonly httpRequestsCurrent: Gauge<string>;
	private readonly urlsCreatedTotal: Counter<string>;
	private readonly authenticationTotal: Counter<string>;
	private readonly databaseConnectionsActive: Gauge<string>;
	private readonly cacheHitsTotal: Counter<string>;
	private readonly cacheMissesTotal: Counter<string>;

	constructor() {
		collectDefaultMetrics({ register });

		this.httpRequestDuration = new Histogram({
			name: "http_request_duration_seconds",
			help: "Duration of HTTP requests in seconds",
			labelNames: ["method", "route", "status_code", "service"],
			buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
		});

		this.httpRequestsTotal = new Counter({
			name: "http_requests_total",
			help: "Total number of HTTP requests",
			labelNames: ["method", "route", "status_code", "service"],
		});

		this.httpRequestsCurrent = new Gauge({
			name: "http_requests_current",
			help: "Current number of HTTP requests being processed",
			labelNames: ["service"],
		});

		this.urlsCreatedTotal = new Counter({
			name: "urls_created_total",
			help: "Total number of URLs created",
			labelNames: ["user_id"],
		});

		this.authenticationTotal = new Counter({
			name: "authentication_total",
			help: "Total number of authentication attempts",
			labelNames: ["type", "status"],
		});

		this.databaseConnectionsActive = new Gauge({
			name: "database_connections_active",
			help: "Number of active database connections",
			labelNames: ["database"],
		});

		this.cacheHitsTotal = new Counter({
			name: "cache_hits_total",
			help: "Total number of cache hits",
			labelNames: ["cache_type"],
		});

		this.cacheMissesTotal = new Counter({
			name: "cache_misses_total",
			help: "Total number of cache misses",
			labelNames: ["cache_type"],
		});

		register.registerMetric(this.httpRequestDuration);
		register.registerMetric(this.httpRequestsTotal);
		register.registerMetric(this.httpRequestsCurrent);
		register.registerMetric(this.urlsCreatedTotal);
		register.registerMetric(this.authenticationTotal);
		register.registerMetric(this.databaseConnectionsActive);
		register.registerMetric(this.cacheHitsTotal);
		register.registerMetric(this.cacheMissesTotal);
	}

	recordHttpRequest(method: string, route: string, statusCode: number, duration: number, service: string): void {
		const labels = { method, route, status_code: statusCode.toString(), service };

		this.httpRequestDuration.observe(labels, duration);
		this.httpRequestsTotal.inc(labels);
	}

	incrementCurrentRequests(service: string): void {
		this.httpRequestsCurrent.inc({ service });
	}

	decrementCurrentRequests(service: string): void {
		this.httpRequestsCurrent.dec({ service });
	}

	recordUrlCreation(userId?: string): void {
		this.urlsCreatedTotal.inc({ user_id: userId || "anonymous" });
	}

	recordAuthentication(type: "login" | "register", status: "success" | "failure"): void {
		this.authenticationTotal.inc({ type, status });
	}

	setDatabaseConnections(database: string, count: number): void {
		this.databaseConnectionsActive.set({ database }, count);
	}

	recordCacheHit(cacheType: string): void {
		this.cacheHitsTotal.inc({ cache_type: cacheType });
	}

	recordCacheMiss(cacheType: string): void {
		this.cacheMissesTotal.inc({ cache_type: cacheType });
	}

	async getMetrics(): Promise<string> {
		return register.metrics();
	}

	getRegistry(): typeof register {
		return register;
	}
}
