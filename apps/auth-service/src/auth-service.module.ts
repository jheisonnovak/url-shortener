import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./config/database.config.service";
import { UserEntity } from "./core/models/entities/user.entity";
import { UserTypeOrmRepository } from "./core/repositories/user.repository";
import { LoginController } from "./core/use-cases/login/login.controller";
import { LoginUseCase } from "./core/use-cases/login/login.use-case";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			inject: [DatabaseConfigService],
		}),
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.register({ secret: process.env.JWT_SECRET }),
	],
	controllers: [LoginController],
	providers: [
		LoginUseCase,
		UserTypeOrmRepository,
		{
			provide: "IUserRepository",
			useClass: UserTypeOrmRepository,
		},
	],
})
export class AuthServiceModule {}
