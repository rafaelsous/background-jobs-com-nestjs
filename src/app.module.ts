import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter'

import { SendMailProducerService } from './jobs/sendMail-producer-service';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { UsersController } from './users/users.controller';
import { MiddlewareBuilder } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
      }
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
  ],
  controllers: [UsersController],
  providers: [
    SendMailProducerService,
    SendMailConsumer,
  ],
})
export class AppModule {
  constructor(@InjectQueue('sendMail-queue') private sendMailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
