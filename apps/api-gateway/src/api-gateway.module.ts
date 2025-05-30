import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthLoginController } from "./interfaces/controllers/auth-login.controller";
import { UrlShortenerController } from "./interfaces/controllers/url-shortener.controller";

const getRmqOptions = (queue: string) => ({
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
	],
	controllers: [AuthLoginController, UrlShortenerController],
	providers: [],
})
export class ApiGatewayModule {}
