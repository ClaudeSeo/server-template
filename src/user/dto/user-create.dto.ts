import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { IsDateFormat } from '~/common/class-validator';

class Agreement {
  @ApiProperty()
  @IsNotEmpty({
    message: '동의서 이름 (`name`) 이 누락되었습니다.',
  })
  name: string;
}

export class CreateUserDto {
  /** 이름 */
  @ApiProperty({
    description: '동의서 이름',
  })
  @IsNotEmpty({
    message: '이름(`name`) 이 누락되었습니다.',
  })
  readonly name: string;

  /** 이메일 */
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail(
    {},
    {
      message: '이메일(`email`) 형식이 아닙니다.',
    }
  )
  @IsNotEmpty({
    message: '이메일(`email`) 이 누락되었습니다.',
  })
  readonly email: string;

  /** 비밀번호 */
  @ApiProperty({
    description: '비밀번호',
  })
  @IsNotEmpty({
    message: '비밀번호(`password`) 이 누락되었습니다.',
  })
  readonly password: string;

  /** 생년월일 */
  @ApiProperty({
    description: '생년월일',
  })
  @IsOptional()
  @IsString()
  @IsDateFormat({
    message: '생년월일(`birthDate)` 는 `yyyy-MM-dd` 형식이어야 합니다.',
  })
  birthDate?: string;

  /** 나이 */
  @ApiProperty({
    description: '나이',
  })
  @ValidateIf(o => o.birthDate === null || o.birthDate === undefined)
  @IsNumber(
    {},
    {
      message: '나이(`age`) 가 누락되었습니다.',
    }
  )
  age?: number;

  /** 동의서 */
  @ApiProperty({
    type: [Agreement],
    description: '동의서 목록',
  })
  @IsArray({
    message: '동의서(`agreements`) 는 배열 형식이어야 합니다.',
  })
  @ArrayMinSize(1, {
    message: '동의서(`agreements`) 는 1개 이상 값이 있어야 합니다.',
  })
  @ValidateNested({ each: true })
  @Type(() => Agreement)
  readonly agreements: Agreement[];
}
