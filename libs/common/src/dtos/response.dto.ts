import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto {
	@ApiProperty()
	message: string;

	constructor(message: string) {
		this.message = message;
	}
}
