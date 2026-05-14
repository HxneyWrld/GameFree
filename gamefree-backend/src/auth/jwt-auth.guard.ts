import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido.');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const user = await this.supabaseService.getUserFromToken(token);
      request.user = user;
      request.token = token;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
