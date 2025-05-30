import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlEntity } from "./core/models/entities/url.entity";
import { UrlTypeOrmRepository } from "./core/repositories/url.repository";
import { GetOriginalUrlController } from "./core/use-cases/get-original-url/get-original-url.controller";
import { GetOriginalUrlUseCase } from "./core/use-cases/get-original-url/get-original-url.use-case";
import { ShortenController } from "./core/use-cases/shorten/shorten.controller";
import { ShortenUseCase } from "./core/use-cases/shorten/shorten.use-case";
import { DatabaseConfigService } from "./shared/config/database.config.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			inject: [DatabaseConfigService],
		}),
		TypeOrmModule.forFeature([UrlEntity]),
	],
	controllers: [GetOriginalUrlController, ShortenController],
	providers: [
		GetOriginalUrlUseCase,
		ShortenUseCase,
		UrlTypeOrmRepository,
		{
			provide: "IUrlRepository",
			useExisting: UrlTypeOrmRepository,
		},
	],
})
export class UrlShortenerModule {}
