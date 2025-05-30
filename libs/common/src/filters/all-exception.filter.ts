import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<any> {
	catch(exception: any, _host: ArgumentsHost): Observable<any> {
		const error = {
			statusCode: exception.status || exception.statusCode || 500,
			message: exception.message || "Internal server error",
			error: exception.name || "InternalServerError",
		};

		return throwError(() => new RpcException(error));
	}
}
