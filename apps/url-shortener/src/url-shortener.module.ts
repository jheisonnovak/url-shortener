import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UrlShortenerController } from "./url-shortener.controller";
import { UrlShortenerService } from "./url-shortener.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [UrlShortenerController],
	providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
