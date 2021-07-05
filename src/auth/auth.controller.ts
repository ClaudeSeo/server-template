import { Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from '~/user/user.decorator';
import { User as _User } from '~/user/user.interface';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto';

@ApiTags('인증')
@Controller('/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ operationId: '이메일 인증' })
  @ApiOkResponse({ description: '성공', type: LoginResponse })
  @UseGuards(LocalAuthGuard)
  @Post('local')
  @HttpCode(200)
  async login(@User() user: _User) {
    return this.authService.login(user);
  }
}
