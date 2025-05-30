import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AllExceptionsFilter } from "../../../libs/common/src";
import { UrlShortenerModule } from "./url-shortener.module";

async function bootstrap() {
	const app = await NestFactory.createMicroservice(UrlShortenerModule, {
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
			queue: "url_shortener_queue",
			queueOptions: {
				durable: false,
			},
		},
	});

	app.useGlobalFilters(new AllExceptionsFilter());
	await app.listen();
}
bootstrap();
