import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsString, Length, Matches, IsNotEmpty } from 'class-validator';
import { UsersQueryRepository } from './users.query.repository';
import {
  DEFAULT_QUERY_PARAMS,
  DEFAULT_USERS_QUERY_PARAMS,
  RequestUsersQueryModel,
} from '../models/types';

import { CheckService } from '../other.services/check.service';
import { UserNotFoundException } from '../exceptions/custom.exceptions';
import { BasicAuthGuard } from '../auth/guards/auth.guards';
export class CreateUserInputModelType {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsNotEmpty()
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
    private readonly checkService: CheckService,
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
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') userId: string) {
    if (!(await this.checkService.isUserExist(userId))) {
      throw new UserNotFoundException();
    }
    return await this.usersService.deleteUserById(userId);
  }
}
