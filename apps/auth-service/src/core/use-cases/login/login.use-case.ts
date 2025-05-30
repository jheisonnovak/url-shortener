import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginUseCase {
	login(loginDto: string): string {
		return loginDto;
	}
}
