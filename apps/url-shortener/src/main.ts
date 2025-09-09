import { AllExceptionsFilter } from "@app/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { UrlShortenerModule } from "./url-shortener.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(UrlShortenerModule);

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL],
			queue: "url_shortener_queue",
			queueOptions: {
				durable: false,
			},
		},
	});

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.startAllMicroservices();
	await app.listen(3002);
}
bootstrap();
