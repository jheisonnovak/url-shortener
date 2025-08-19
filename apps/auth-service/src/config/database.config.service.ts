import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { UserEntity } from "../core/models/entities/user.entity";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: "postgres",
			host: this.configService.get<string>("DB_AUTH_HOST") || "postgres-auth-master",
			port: this.configService.get<number>("DB_AUTH_PORT") || 5432,
			username: this.configService.get<string>("DB_USERNAME"),
			password: this.configService.get<string>("DB_PASSWORD"),
			database: this.configService.get<string>("DB_NAME_AUTH") || "auth_service",
			entities: [UserEntity],
			synchronize: true,
		};
	}
}
