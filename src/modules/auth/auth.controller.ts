import { Controller, Get, Post, HttpCode, HttpStatus, Req, UseGuards, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateGuestUserUseCase } from '../../core/user/use-cases/create-guest-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createGuestUserUseCase: CreateGuestUserUseCase,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = await this.authService.login(req.user);
    // Ideally redirect to frontend with token, e.g.
    // res.redirect(`http://localhost:3000/login?token=${access_token}`);
    res.json({ access_token });
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    // Initiates the Facebook OAuth2 flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = await this.authService.login(req.user);
    res.json({ access_token });
  }

  @Post('guest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a temporary guest user and return a JWT token' })
  async guestLogin(@Res() res) {
    // 1. Create a guest user in the DB
    const guestUser = await this.createGuestUserUseCase.execute();
    
    // 2. Generate a JWT token for the new guest user
    const { access_token } = await this.authService.login(guestUser);
    
    // 3. Return the token and the user's public info
    res.json({ access_token, user: guestUser.toPublic() });
  }
}

