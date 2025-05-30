import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlEntity } from "./core/models/entities/url.entity";
import { UrlTypeOrmRepository } from "./core/repositories/url.repository";
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
	controllers: [ShortenController],
	providers: [
		ShortenUseCase,
		UrlTypeOrmRepository,
		{
			provide: "IUrlRepository",
			useExisting: UrlTypeOrmRepository,
		},
	],
})
export class UrlShortenerModule {}
