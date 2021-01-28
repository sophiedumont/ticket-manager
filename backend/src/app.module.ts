import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://sophie:ticket@localhost:27017/ticket-manager',
    ),
    TicketsModule,
    AuthModule,
    UsersModule,
    AdminModule,
  ],
})
export class AppModule {}
