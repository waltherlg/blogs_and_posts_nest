import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersDevice, UsersDeviceDocument } from './users-devices.types';

@Injectable()
export class UsersDevicesRepository {
  constructor(
    @InjectModel(UsersDevice.name)
    private usersDeviseModel: Model<UsersDeviceDocument>,
  ) {}
  async addDeviceInfo(deviceInfoDTO): Promise<boolean> {
    const newDeviceInfo = new this.usersDeviseModel(deviceInfoDTO);
    const result = await newDeviceInfo.save();
    return !!result;
  }
  async getDeviceByUsersAndDeviceId(userId: string, deviceId: string) {
    if (!(Types.ObjectId.isValid(userId) && Types.ObjectId.isValid(deviceId))) {
      return null;
    }
    const _id = new Types.ObjectId(deviceId);
    const userIdObj = new Types.ObjectId(userId);
    const device = await this.usersDeviseModel.findOne({
      $and: [{ _id: deviceId }, { userId: userId }],
    });
    if (!device) {
      return null;
    }
    return device;
  }
  async refreshDeviceInfo(
    deviceId,
    lastActiveDate,
    expirationDate,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(deviceId)) {
      return false;
    }
    const userDevice = await this.usersDeviseModel.findById(deviceId);
    userDevice.lastActiveDate = lastActiveDate;
    userDevice.expirationDate = expirationDate;
    const result = userDevice.save();
    return !!result;
  }
  async getActiveUserDevices(userId: string) {
    console.log('userId ', userId);
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    const activeUserDevices = await this.usersDeviseModel.find({
      userId: userId,
    });
    console.log('activeUserDevices ', activeUserDevices);
    return activeUserDevices.map((device: UsersDeviceDocument) => {
      return device.prepareUsersDeviceForOutput();
    });
  }
  async deleteUserDeviceById(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    if (Types.ObjectId.isValid(deviceId)) {
      const result = await this.usersDeviseModel.deleteOne({
        $and: [{ _id: deviceId }, { userId: userId }],
      });
      return result.deletedCount === 1;
    } else return false;
  }
  async deleteAllUsersDevices() {
    return await this.usersDeviseModel.deleteMany({});
  }
}
