import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({
    description: '유저 ID',
  })
  _id: string;
}
