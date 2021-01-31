import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { TicketPriorityEnum } from '../tickets/enums/ticket-priority.enum';
import { TicketTypeEnum } from '../tickets/enums/ticket-type.enum';

@Injectable()
export class FixturesService {
  adminIds: string[] = [];
  userIds: string[] = [];

  constructor(
    private readonly userService: UsersService,
    private ticketService: TicketsService,
  ) {}

  public async makeFixtures() {
    await this.makeAdmins();
    await this.makeUsers();
    await this.makeTickets();
  }

  private async makeAdmins() {
    this.adminIds.push(
      (
        await this.userService.createAdmin({
          email: 'admin1@admin.com',
          password: 'admin974',
          username: 'Admin1',
        })
      )._id.toString(),
    );
    this.adminIds.push(
      (
        await this.userService.createAdmin({
          email: 'admin2@admin.com',
          password: 'admin974',
          username: 'Admin2',
        })
      )._id.toString(),
    );
    this.adminIds.push(
      (
        await this.userService.createAdmin({
          email: 'admin3@admin.com',
          password: 'admin974',
          username: 'Admin3',
        })
      )._id.toString(),
    );
  }

  private async makeUsers() {
    this.userIds.push(
      (
        await this.userService.create({
          email: 'user1@user.com',
          password: 'user974',
          username: 'User1',
        })
      )._id.toString(),
    );
    this.userIds.push(
      (
        await this.userService.create({
          email: 'user2@user.com',
          password: 'user974',
          username: 'User2',
        })
      )._id.toString(),
    );
    this.userIds.push(
      (
        await this.userService.create({
          email: 'user3@user.com',
          password: 'user974',
          username: 'User3',
        })
      )._id.toString(),
    );
    this.userIds.push(
      (
        await this.userService.create({
          email: 'user4@user.com',
          password: 'user974',
          username: 'User4',
        })
      )._id.toString(),
    );
  }

  private async makeTickets() {
    for (let i = 0; i < 15; i++) {
      const ticket = await this.ticketService.createWithCreator(
        this.getRandomUserId(),
        {
          content: `This is a ticket ${i}`,
          priority: TicketPriorityEnum.MEDIUM,
          subject: `Subject ${i}`,
          type: TicketTypeEnum.QUESTION,
        },
      );
      await this.ticketService.updateDocument(ticket._id.toString(), {
        assignedTo: this.getRandomAdminId(),
      });
    }
  }

  private getRandomUserId() {
    return this.userIds[
      Math.floor(Math.random() * Math.floor(this.userIds.length))
    ];
  }

  private getRandomAdminId() {
    return this.adminIds[
      Math.floor(Math.random() * Math.floor(this.userIds.length))
    ];
  }
}
