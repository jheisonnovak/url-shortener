import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedResponseDto } from "../../../../libs/common/src";

export const PaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(PaginatedResponseDto, model),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDto) },
					{
						properties: {
							data: {
								type: "array",
								items: { $ref: getSchemaPath(model) },
							},
						},
					},
				],
			},
		})
	);
};
