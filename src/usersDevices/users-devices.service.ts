import { Injectable } from '@nestjs/common';
import { UsersDevicesRepository } from './usersDevicesRepository';

@Injectable()
export class UsersDeviceService {
  constructor(private readonly usersDeviceRepository: UsersDevicesRepository) {}
  async getCurrentDevise(userId: string, deviceId: string) {
    const currentDevice =
      await this.usersDeviceRepository.getDeviceByUsersAndDeviceId(
        userId,
        deviceId,
      );
    return currentDevice;
  }
  async getActiveUserDevices(userId: string) {
    const foundDevices =
      this.usersDeviceRepository.getActiveUserDevices(userId);
    return foundDevices;
  }
}
