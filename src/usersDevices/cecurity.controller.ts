import { Controller } from '@nestjs/common';
import { UsersDevicesRepository } from './usersDevicesRepository';

@Controller('security')
export class SecurityController {
  constructor(private readonly usersDeviceRepository: UsersDevicesRepository) {}
}
