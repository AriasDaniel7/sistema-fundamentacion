import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth()
  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Auth()
  @Get('user/:term')
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }
}
