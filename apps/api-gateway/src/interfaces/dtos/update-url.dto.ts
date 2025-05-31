import { OmitType } from "@nestjs/swagger";
import { CreateUrlDto } from "./create-url.dto";

export class UpdateUrlDto extends OmitType(CreateUrlDto, ["customCode"]) {}
