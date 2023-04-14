import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from './test.service';
import { AppService } from '../app.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly appService: AppService,
    private readonly testingService: TestingService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    return await this.testingService.deleteAllData();
  }
}
