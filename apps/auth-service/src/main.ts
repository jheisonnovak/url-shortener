import { AllExceptionsFilter } from "@app/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AuthServiceModule } from "./auth-service.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AuthServiceModule);

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL],
			queue: "auth_queue",
			queueOptions: {
				durable: false,
			},
		},
	});

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.startAllMicroservices();
	await app.listen(3001);
}
bootstrap();
