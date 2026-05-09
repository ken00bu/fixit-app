import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { R2Module } from './r2/r2.module';
import { PriorityModule } from './priority/priority.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    AuthModule, 
    ReportsModule, 
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_USE'),
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    CategoriesModule,
    LocationsModule,
    R2Module,
    PriorityModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}