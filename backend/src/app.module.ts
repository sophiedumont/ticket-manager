import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://sophie:ticket@localhost:27017/ticket-manager',
    ),
    TicketsModule,
  ],
})
export class AppModule {}
