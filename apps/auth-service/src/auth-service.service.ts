import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthServiceService {
	login(loginDto: string): string {
		return loginDto;
	}
}
