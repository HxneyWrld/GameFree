import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class GamesService {
  constructor(private supabaseService: SupabaseService) {}

  async getFreeGames(authHeader?: string) {
    try {
      let claimedIds: number[] = [];
      const db = this.supabaseService.getClient();

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await db.auth.getUser(token);

        if (user) {
          const { data: claimed } = await db
            .from('user_claimed_games')
            .select('game_id')
            .eq('user_id', user.id);

          claimedIds = (claimed ?? []).map((r) => r.game_id);
        }
      }

      let query = db
        .from('games')
        .select('*')
        .order('expiration_date', { ascending: true, nullsFirst: false });

      if (claimedIds.length > 0) {
        query = query.not('id', 'in', `(${claimedIds.join(',')})`);
      }

      const { data: games, error } = await query;
      if (error) throw new Error(error.message);

      return { success: true, count: games.length, data: games };
    } catch (err) {
      throw new InternalServerErrorException('Error interno.');
    }
  }

  async getDeals(minDiscount: number) {
    try {
      const db = this.supabaseService.getClient();
      const { data: deals, error } = await db
        .from('deals')
        .select('*')
        .gte('discount_pct', minDiscount)
        .order('discount_pct', { ascending: false })
        .limit(300);

      if (error) throw new Error(error.message);

      return { success: true, count: deals.length, data: deals };
    } catch (err) {
      throw new InternalServerErrorException('Error interno.');
    }
  }

  async getDealDetails(id: string) {
    try {
      const db = this.supabaseService.getClient();
      const { data, error } = await db
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new NotFoundException('Oferta no encontrada.');
      }

      return { success: true, data };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Error interno.');
    }
  }

  async getGameDetails(id: string) {
    try {
      const db = this.supabaseService.getClient();
      const { data, error } = await db
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new NotFoundException('Juego no encontrado.');
      }

      return { success: true, data };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Error interno del servidor.');
    }
  }

  async claimGame(gameId: string, userId: string, token: string) {
    const db = this.supabaseService.getClientAs(token);

    const { error } = await db
      .from('user_claimed_games')
      .insert({ user_id: userId, game_id: gameId });

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'Ya reclamado anteriormente.', alreadyClaimed: true };
      }
      throw new InternalServerErrorException(error.message);
    }

    return { success: true, message: 'Juego marcado como reclamado.' };
  }

  async unclaimGame(gameId: string, userId: string, token: string) {
    const db = this.supabaseService.getClientAs(token);

    const { error } = await db
      .from('user_claimed_games')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { success: true, message: 'Desmarcado correctamente.' };
  }

  async favoriteGame(gameId: string, userId: string, token: string) {
    const db = this.supabaseService.getClientAs(token);

    const { error } = await db
      .from('user_favorites')
      .insert({ user_id: userId, game_id: gameId });

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya está en favoritos.');
      }
      throw new InternalServerErrorException(error.message);
    }

    return { success: true, message: 'Agregado a favoritos.' };
  }

  async unfavoriteGame(gameId: string, userId: string, token: string) {
    const db = this.supabaseService.getClientAs(token);

    const { error } = await db
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { success: true, message: 'Quitado de favoritos.' };
  }
}
