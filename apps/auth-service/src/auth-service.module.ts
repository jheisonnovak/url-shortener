import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthServiceController } from "./auth-service.controller";
import { AuthServiceService } from "./auth-service.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [AuthServiceController],
	providers: [AuthServiceService],
})
export class AuthServiceModule {}
