import { Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from '~/user/user.decorator';
import { User as _User } from '~/user/user.interface';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalLoginRequest, LoginResponse } from './dto';

@ApiTags('인증')
@Controller('/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ operationId: '이메일 로그인' })
  @ApiOkResponse({ description: '성공', type: LoginResponse })
  @ApiBody({ type: LocalLoginRequest })
  @UseGuards(LocalAuthGuard)
  @Post('local')
  @HttpCode(200)
  async login(@User() user: _User) {
    return this.authService.login(user);
  }
}
