import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';
import { FixturesService } from './fixtures.service';

@Module({
  imports: [UsersModule, TicketsModule],
  providers: [FixturesService],
  exports: [FixturesService],
})
export class FixturesModule {}
