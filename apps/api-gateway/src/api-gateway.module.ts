import { JwtStrategy, MetricsController, MetricsInterceptor, MetricsModule, MetricsService } from "@app/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthLoginController } from "./interfaces/controllers/auth-login.controller";
import { UrlShortenerController } from "./interfaces/controllers/url-shortener.controller";

const getRmqOptions = (queue: string): object => ({
	urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
	queue,
	queueOptions: {
		durable: false,
	},
});

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ClientsModule.register([
			{
				name: "AUTH_SERVICE",
				transport: Transport.RMQ,
				options: getRmqOptions("auth_queue"),
			},
			{
				name: "URL_SHORTENER_SERVICE",
				transport: Transport.RMQ,
				options: getRmqOptions("url_shortener_queue"),
			},
		]),
		MetricsModule,
	],
	controllers: [MetricsController, AuthLoginController, UrlShortenerController],
	providers: [
		JwtStrategy,
		{
			provide: APP_INTERCEPTOR,
			useFactory: (metricsService: MetricsService): MetricsInterceptor => new MetricsInterceptor(metricsService, "api-gateway"),
			inject: [MetricsService],
		},
	],
})
export class ApiGatewayModule {}
