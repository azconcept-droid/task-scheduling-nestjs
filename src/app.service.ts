import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'tasks',
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

  // Then use it in a class as follows. Assume a cron job was created with the following declaration:
  @Cron('* * 8 * * *', {
    name: 'notifications',
  })
  triggerNotifications() {}
  
  callJob() {
    const job = this.schedulerRegistry.getCronJob('notifications');
    job.stop();
    console.log(job.lastDate());
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  // @Interval('notifications', 2500)
  // handleInterva() {
  //   this.logger.debug('Called every 2500 seconds');
  // }
}
