import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception.error && exception.error.statusCode) {
			const errorData = exception.error;
			return response.status(errorData.statusCode).json({
				statusCode: errorData.statusCode,
				message: errorData.message,
				error: errorData.error,
			});
		}

		if (exception.getError && typeof exception.getError === "function") {
			const error = exception.getError();
			const status = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
			return response.status(status).json({
				statusCode: status,
				message: error.message,
				error: error.error,
			});
		}

		const status = exception.status || exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
		response.status(status).json({
			statusCode: status,
			message: exception.message || "Internal server error",
			error: exception.name || "InternalServerError",
		});
	}
}
