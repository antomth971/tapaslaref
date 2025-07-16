import { Controller, Get, Req, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
