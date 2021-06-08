import { Body, Controller, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer-service';

import { ICreateUserDTO } from './create-user-dto';

@Controller('users')
export class UsersController {
  constructor(private sendMailProducerService: SendMailProducerService) {}

  @Post('/')
  async createUser(@Body() user: ICreateUserDTO) {
    await this.sendMailProducerService.sendMail(user);

    return user;
  }
}
