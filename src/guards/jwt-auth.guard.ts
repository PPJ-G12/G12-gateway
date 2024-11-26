import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
  
      try {
        const payload = this.jwtService.verify(token, { secret: 'JWT_SECRET' }); // Usa la misma clave que el Auth Service
        request.user = payload; // Añadir información del usuario al request
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  