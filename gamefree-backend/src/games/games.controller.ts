import { Controller, Get, Post, Delete, Param, Headers, Request, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('free')
  async getFreeGames(@Headers('authorization') authHeader?: string) {
    return this.gamesService.getFreeGames(authHeader);
  }

  @Get(':id')
  async getGameDetails(@Param('id') id: string) {
    return this.gamesService.getGameDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  async claimGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.claimGame(id, req.user.id, req.token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/claim')
  async unclaimGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.unclaimGame(id, req.user.id, req.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  async favoriteGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.favoriteGame(id, req.user.id, req.token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  async unfavoriteGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.unfavoriteGame(id, req.user.id, req.token);
  }
}
