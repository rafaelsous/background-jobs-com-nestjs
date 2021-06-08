import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ICreateUserDTO } from 'src/users/create-user-dto';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailerService: MailerService) {}
  
  @Process('sendMail-job')
  async sendMailJob(job: Job<ICreateUserDTO>) {
    const { data } = job;
    
    await this.mailerService.sendMail({
      to: data.email,
      from: '<contato@contato.com.br>',
      subject: 'Seja bem-vindo(a)!',
      text: `Olá, ${data.name} seu cadastro foi realizado com sucesso. A partir de agora você já pode acessar nossa plataforma.`,
    });
  }
}

export { SendMailConsumer }