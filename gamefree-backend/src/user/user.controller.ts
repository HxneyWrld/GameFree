import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('library')
  async getLibrary(@Request() req: any) {
    return this.userService.getLibrary(req.user.id);
  }

  @Get('favorites')
  async getFavorites(@Request() req: any) {
    return this.userService.getFavorites(req.user.id);
  }
}
