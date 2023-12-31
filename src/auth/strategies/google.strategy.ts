import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pattern } from 'src/utils/Pattern';
import { isNumeric } from 'src/utils/number';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const id = profile.id;
      let { familyName, givenName } = profile.name;
      const email = profile.emails[0].value;

      if (Pattern.SUNRIN_EMAIL_PATTERN.test(email)) {
        if (isNumeric(familyName))
          givenName = [familyName, (familyName = givenName)][0];
        const userClass = parseInt(givenName.substring(1, 3));

        const user = await this.userRepository.findOneBy({ googleId: id });

        if (user) {
          return done(null, user);
        }

        const newUser = this.userRepository.create({
          googleId: id,
          email: profile.emails[0].value,
          username: familyName,
          grade: +givenName.substring(0, 1),
          class: userClass,
          number: +givenName.substring(3, 5),
        });
        await this.userRepository.save(newUser);

        return done(null, newUser);
      }
      return done(null, undefined, { reason: 'Unauthorized' });
    } catch (err) {
      return done(null, undefined, { reason: 'Unauthorized' });
    }
  }
}
