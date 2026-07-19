import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateOAuthLoginUseCase, OAuthLoginCommand } from '../../core/user/use-cases/validate-oauth-login.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly validateOAuthLoginUseCase: ValidateOAuthLoginUseCase,
  ) {}

  async validateOAuthLogin(oauthProfile: OAuthLoginCommand) {
    try {
      return await this.validateOAuthLoginUseCase.execute(oauthProfile);
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}

