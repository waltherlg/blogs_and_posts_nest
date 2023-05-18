import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersDevicesRepository } from './usersDevicesRepository';
import { RefreshTokenGuard } from '../auth/guards/refreshToken.guard';
import { UsersDeviceService } from './users-devices.service';
import { UnableException } from '../exceptions/custom.exceptions';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly usersDeviceRepository: UsersDevicesRepository,
    private readonly usersDeviceService: UsersDeviceService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async devices(@Req() request) {
    console.log('request.user ', request.user);
    const usersDevises = await this.usersDeviceService.getActiveUserDevices(
      request.user.userId,
    );
    if (!usersDevises) {
      throw new UnableException('get devices');
    }
    return usersDevises;
  }
}
