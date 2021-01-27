import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TicketsController } from '../tickets/tickets.controller';
import { TicketsService } from '../tickets/tickets.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [UsersModule, TicketsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
