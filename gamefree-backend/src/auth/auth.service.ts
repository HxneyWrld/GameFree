import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("El correo y la contraseña son obligatorios.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException("El formato del correo no es válido.");
    }

    if (password.length < 8) {
      throw new BadRequestException("La contraseña debe tener al menos 8 caracteres.");
    }

    if (password.length > 64) {
      throw new BadRequestException("La contraseña no debe exceder los 64 caracteres.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException("La contraseña debe tener al menos una mayúscula, una minúscula y un número.");
    }

    const db = this.supabaseService.getClient();
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: "https://gamefree.store" }
    });

    if (error) {
      if (error.message.includes("already registered") || (error as any).status === 422) {
        throw new ConflictException("Este correo ya tiene una cuenta registrada.");
      }
      throw new BadRequestException(error.message);
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new ConflictException("Este correo ya tiene una cuenta registrada.");
    }

    if (!data.user) {
      throw new BadRequestException("Error al crear la cuenta.");
    }

    return {
      success: true,
      message: "Cuenta creada. Revisa tu correo para confirmarla.",
      user: { id: data.user.id, email: data.user.email }
    };
  }

  async login(body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("Email y contraseña requeridos.");
    }

    const db = this.supabaseService.getClient();
    const { data, error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    return {
      success: true,
      token: data.session.access_token,
      user: { id: data.user.id, email: data.user.email },
    };
  }

  async recover(body: any) {
    const { email } = body;

    if (!email) {
      throw new BadRequestException("Email requerido.");
    }

    const db = this.supabaseService.getClient();
    const { error } = await db.auth.resetPasswordForEmail(email);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
    };
  }

  async resetPassword(body: any) {
    const { password, access_token, refresh_token } = body;
    
    if (!password || !access_token || !refresh_token) {
      throw new BadRequestException("Faltan credenciales para el restablecimiento.");
    }

    const db = this.supabaseService.getClient();
    const { error: sessionError } = await db.auth.setSession({ access_token, refresh_token });

    if (sessionError) {
      throw new BadRequestException("Sesión expirada o inválida. Solicita un nuevo correo.");
    }

    const { error } = await db.auth.updateUser({ password });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true, message: "Contraseña actualizada exitosamente." };
  }
}
