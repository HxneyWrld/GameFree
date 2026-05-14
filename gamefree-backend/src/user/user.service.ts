import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  async getLibrary(userId: string) {
    try {
      const db = this.supabaseService.getClient();
      const { data, error } = await db
        .from('user_claimed_games')
        .select(`
          claimed_at,
          games (
            id, title, thumbnail_url, store_name,
            claim_url, original_price
          )
        `)
        .eq('user_id', userId)
        .order('claimed_at', { ascending: false });

      if (error) throw new Error(error.message);

      return { success: true, count: data.length, data };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getFavorites(userId: string) {
    try {
      const db = this.supabaseService.getClient();
      const { data, error } = await db
        .from('user_favorites')
        .select(`
          favorited_at,
          games (
            id, title, thumbnail_url, store_name,
            claim_url, original_price
          )
        `)
        .eq('user_id', userId)
        .order('favorited_at', { ascending: false });

      if (error) throw new Error(error.message);

      return { success: true, count: data.length, data };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
