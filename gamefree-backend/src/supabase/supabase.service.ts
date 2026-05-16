import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl: string;
  private readonly supabaseAnonKey: string;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    this.supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY') || '';

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabase variables are missing!');
    }
  }

  // Returns standard anon client
  getClient(): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  // Returns client authenticated as a specific user based on JWT
  getClientAs(token: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
  }

  // Helper to get user from token
  async getUserFromToken(token: string): Promise<User> {
    const client = this.getClient();
    const { data: { user }, error } = await client.auth.getUser(token);
    
    if (error || !user) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
    
    return user;
  }
}
