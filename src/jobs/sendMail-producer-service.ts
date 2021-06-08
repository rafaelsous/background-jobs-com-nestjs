import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { ICreateUserDTO } from 'src/users/create-user-dto';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private sendMailQueue: Queue) {}

  async sendMail(user: ICreateUserDTO) {
    await this.sendMailQueue.add('sendMail-job', user);
  }

}

export { SendMailProducerService };