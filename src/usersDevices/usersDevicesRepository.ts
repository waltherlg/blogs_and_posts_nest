import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
