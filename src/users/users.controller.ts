import { UsersService } from './users.service';
import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { UsersQueryRepository } from './users.query.repository';
export class CreateUserInputModelType {
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  @Length(1, 100)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post()
  async createUser(@Body() userCreateInputModel: CreateUserInputModelType) {
    const newUsersId = await this.usersService.createUser(userCreateInputModel);
    return await this.usersQueryRepository.getUserById(newUsersId);
  }
}
