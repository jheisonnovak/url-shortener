import { ApiProperty } from "@nestjs/swagger";

export class ListUserDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	constructor(id: string, username: string, email: string) {
		this.id = id;
		this.username = username;
		this.email = email;
	}
}
