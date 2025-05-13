import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'notifications',
    timeZone: 'Africa/Lagos',
  })
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

  // @Interval('notifications', 2500)
  // handleInterva() {
  //   this.logger.debug('Called every 2500 seconds');
  // }
}
