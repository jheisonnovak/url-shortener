import { NestFactory } from "@nestjs/core";
import { GlobalExceptionFilter } from "../../../libs/common/src";
import { ApiGatewayModule } from "./api-gateway.module";

async function bootstrap() {
	const app = await NestFactory.create(ApiGatewayModule);

	app.useGlobalFilters(new GlobalExceptionFilter());

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
