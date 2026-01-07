import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { DisastersModule } from './disasters';
import { ReportsModule } from './reports';
import { AuthModule } from './auth';
import { EvacuationModule } from './evacuation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    DisastersModule,
    ReportsModule,
    EvacuationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
