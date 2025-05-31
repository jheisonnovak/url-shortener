import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const timestamp = new Date().toISOString();
		const requestPath = request.url;
		const method = request.method;

		if (exception.error && exception.error.statusCode) {
			const errorData = exception.error;
			return response.status(errorData.statusCode).json({
				statusCode: errorData.statusCode,
				message: errorData.message,
				error: errorData.error,
			});
		}

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let error = "Internal Server Error";
		let message = "Algo deu errado. Entre em contato com o suporte.";
		let stackTrace: string | undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const responseBody = exception.getResponse();

			if (typeof responseBody === "object") {
				error = (responseBody as any).error ?? undefined;
				message = (responseBody as any).message ?? message;
			} else {
				message = responseBody as string;
			}
		}

		if (exception instanceof Error) {
			stackTrace = exception.stack;
		}

		if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
			process.env.NODE_ENV === "development"
				? console.error(exception)
				: this.logger.error(`[${timestamp}] ${method} ${requestPath} - ${status}: ${message} - ${exception}`);
		}

		response.status(status).json({
			statusCode: status,
			error,
			message,
		});
	}
}
