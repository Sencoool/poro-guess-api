import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') || 'dummy_id',
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || 'dummy_secret',
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3000/auth/facebook/callback',
      scope: ['email', 'public_profile'],
      profileFields: ['emails', 'name', 'id'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails && emails.length > 0 ? emails[0].value : null,
      firstName: name.givenName,
      lastName: name.familyName,
      providerId: id,
      provider: 'facebook',
    };
    
    // We delegate the validation/creation of the user to AuthService
    const validatedUser = await this.authService.validateOAuthLogin(user);
    done(null, validatedUser);
  }
}
