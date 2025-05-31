import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./config/database.config.service";
import { UrlEntity } from "./core/models/entities/url.entity";
import { UrlTypeOrmRepository } from "./core/repositories/url.repository";
import { DeleteController } from "./core/use-cases/delete/delete.controller";
import { DeleteUseCase } from "./core/use-cases/delete/delete.use-case";
import { FindAllUrlsController } from "./core/use-cases/find-all-urls/find-all-urls.controller";
import { FindAllUrlsUseCase } from "./core/use-cases/find-all-urls/find-all-urls.use-case";
import { GetOriginalUrlController } from "./core/use-cases/get-original-url/get-original-url.controller";
import { GetOriginalUrlUseCase } from "./core/use-cases/get-original-url/get-original-url.use-case";
import { ShortenController } from "./core/use-cases/shorten/shorten.controller";
import { ShortenUseCase } from "./core/use-cases/shorten/shorten.use-case";

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
	controllers: [GetOriginalUrlController, ShortenController, FindAllUrlsController, DeleteController],
	providers: [
		GetOriginalUrlUseCase,
		ShortenUseCase,
		FindAllUrlsUseCase,
		DeleteUseCase,
		UrlTypeOrmRepository,
		{
			provide: "IUrlRepository",
			useExisting: UrlTypeOrmRepository,
		},
	],
})
export class UrlShortenerModule {}
