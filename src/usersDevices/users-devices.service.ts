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
    const foundDevices = await this.usersDeviceRepository.getActiveUserDevices(
      userId,
    );
    return foundDevices;
  }

  async deleteUserDeviceById(user) {
    const isUserDeviceDeleted =
      await this.usersDeviceRepository.deleteUserDeviceById(user);
    return isUserDeviceDeleted;
  }

  async deleteAllUserDevicesExceptCurrent(user) {
    const isDevicesDeleted =
      await this.usersDeviceRepository.deleteAllUserDevicesExceptCurrent(user);
    return isDevicesDeleted;
  }
}
