import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    description: '접근 토큰',
  })
  access_token: string;
}
