import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { UsersQueryRepository } from './users.query.repository';
import {
  DEFAULT_QUERY_PARAMS,
  DEFAULT_USERS_QUERY_PARAMS,
  RequestUsersQueryModel,
} from '../models/types';
import { BasicAuthGuard } from '../guards/auth.guards';
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
  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() userCreateInputModel: CreateUserInputModelType) {
    const newUsersId = await this.usersService.createUser(userCreateInputModel);
    const user = await this.usersQueryRepository.getUserById(newUsersId);
    return user;
  }

  @Get()
  async getAllUsers(@Query() queryParams: RequestUsersQueryModel) {
    const mergedQueryParams = { ...DEFAULT_USERS_QUERY_PARAMS, ...queryParams };
    return await this.usersQueryRepository.getAllUsers(mergedQueryParams);
  }
}
