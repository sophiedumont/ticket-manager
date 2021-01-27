import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [UsersModule, TicketsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
