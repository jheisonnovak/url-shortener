import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { UrlEntity } from "../core/models/entities/url.entity";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: "postgres",
			host: this.configService.get<string>("DB_HOST"),
			port: this.configService.get<number>("DB_PORT"),
			username: this.configService.get<string>("DB_USERNAME"),
			password: this.configService.get<string>("DB_PASSWORD"),
			database: this.configService.get<string>("DB_NAME_SHORTENER"),
			entities: [UrlEntity],
			synchronize: true,
		};
	}
}
