import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { DATABASE_CONNECTION_NAME } from '~/config/environment.constant';

@ApiTags('서버')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    @InjectConnection(DATABASE_CONNECTION_NAME.MAIN)
    private mainDBConnection: Connection
  ) {}

  @ApiOperation({ operationId: '서버 상태 체크' })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck(DATABASE_CONNECTION_NAME.MAIN, {
          connection: this.mainDBConnection,
        }),
    ]);
  }
}
