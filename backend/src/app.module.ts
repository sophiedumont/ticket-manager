import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { FixturesModule } from './fixtures/fixtures.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://sophie:ticket@mongodb:27017/ticket-manager',
    ),
    TicketsModule,
    AuthModule,
    UsersModule,
    AdminModule,
    FixturesModule,
  ],
})
export class AppModule {}
