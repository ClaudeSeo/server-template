import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginRequest {
  @ApiProperty({
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    description: '비밀번호',
  })
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    description: '접근 토큰',
  })
  access_token: string;
}
