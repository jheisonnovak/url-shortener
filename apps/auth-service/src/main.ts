import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AllExceptionsFilter } from "../../../libs/common/src";
import { AuthServiceModule } from "./auth-service.module";

async function bootstrap() {
	const app = await NestFactory.createMicroservice(AuthServiceModule, {
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
			queue: "auth_queue",
			queueOptions: {
				durable: false,
			},
		},
	});

	app.useGlobalFilters(new AllExceptionsFilter());
	await app.listen();
}
bootstrap();
