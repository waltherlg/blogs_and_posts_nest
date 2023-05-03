import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersDevicesRepository } from './usersDevicesRepository';
import { RefreshTokenGuard } from '../auth/guards/refreshToken.guard';
import { UsersDeviceService } from './users-devices.service';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly usersDeviceRepository: UsersDevicesRepository,
    private readonly usersDeviceService: UsersDeviceService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async devices(@Req() request) {
    console.log(request.userId);
    const usersDevises = await this.usersDeviceService.getActiveUserDevices(
      request.userId!,
    );
    return usersDevises;
  }
}
