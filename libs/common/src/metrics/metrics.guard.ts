import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class MetricsGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const clientIp = request.ip || request.connection.remoteAddress || request.socket.remoteAddress;

		const realIp = clientIp.replace(/^::ffff:/, "");

		const allowedIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

		const isDockerNetwork = this.isPrivateIP(realIp);
		const isAllowedIP = allowedIPs.includes(clientIp);

		if (!isAllowedIP && !isDockerNetwork) {
			throw new ForbiddenException(`Access denied for IP: ${clientIp}`);
		}

		return true;
	}

	private isPrivateIP(ip: string): boolean {
		const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
		const match = ip.match(ipRegex);

		if (!match) return false;

		const [, a, b, c, d] = match.map(Number);
		if (a > 255 || b > 255 || c > 255 || d > 255) return false;
		return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
	}
}
