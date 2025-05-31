import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
	@ApiProperty()
	access_token: string;

	constructor(access_token: string) {
		this.access_token = access_token;
	}
}
