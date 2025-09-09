import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalExceptionFilter } from "../../../libs/common/src";
import { ApiGatewayModule } from "./api-gateway.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(ApiGatewayModule);

	const config = new DocumentBuilder()
		.setTitle("URL Shortener API Gateway")
		.setDescription("URL Shortener API Gateway Documentation")
		.setVersion(process.env.npm_package_version ?? "0.0.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config, { autoTagControllers: false });
	SwaggerModule.setup("api/docs", app, document, { customSiteTitle: "API Gateway - URL Shortener" });

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
