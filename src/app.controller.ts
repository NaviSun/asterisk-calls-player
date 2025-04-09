import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ActiveUser } from './auth/decorators/active-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ActiveUserData } from './auth/interface/active_user_data_jwt.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth()
  getHello(@ActiveUser() user: ActiveUserData) {
    return this.appService.getHello(user);
  }
}
 