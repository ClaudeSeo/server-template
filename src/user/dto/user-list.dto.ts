import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    description: '유저 ID',
  })
  _id: string;

  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저 이메일',
  })
  email: string;
}

export class GetUserListResponse {
  @ApiProperty({
    type: [User],
    description: '아이템 목록',
  })
  items: User[];
}
