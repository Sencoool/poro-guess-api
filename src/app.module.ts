import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ChampionModule } from './modules/champion/champion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ChampionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
