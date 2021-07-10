import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsDateFormat } from '~/common/class-validator';
import { VALIDATION_MESSAGE } from '../user.message';

class Agreement {
  @ApiProperty()
  @IsNotEmpty({
    message: VALIDATION_MESSAGE.REQUIRED_AGREEMENT_NAME,
  })
  name: string;
}

export class CreateUserDto {
  /** 이름 */
  @ApiProperty({
    description: '이름',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGE.REQUIRED_USER_NAME,
  })
  readonly name: string;

  /** 이메일 */
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGE.INVALID_EMAIL_FORMAT,
    }
  )
  @IsNotEmpty({
    message: VALIDATION_MESSAGE.REQUIRED_EMAIL,
  })
  readonly email: string;

  /** 비밀번호 */
  @ApiProperty({
    description: '비밀번호',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGE.REQUIRED_PASSWORD,
  })
  readonly password: string;

  /** 생년월일 */
  @ApiProperty({
    description: '생년월일',
  })
  @IsOptional()
  @IsString()
  @IsDateFormat({
    message: VALIDATION_MESSAGE.INVALID_BIRTH_DATE_FORMAT,
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
      message: VALIDATION_MESSAGE.REQUIRED_AGE,
    }
  )
  age?: number;

  /** 동의서 */
  @ApiProperty({
    type: [Agreement],
    description: '동의서 목록',
  })
  @IsArray({
    message: VALIDATION_MESSAGE.WRONG_TYPE_OF_AGREEMENTS,
  })
  @ArrayMinSize(1, {
    message: VALIDATION_MESSAGE.MIN_AGREEMENTS,
  })
  @ValidateNested({ each: true })
  @Type(() => Agreement)
  readonly agreements: Agreement[];
}

export class CreateUserResponse {
  @ApiProperty({
    description: '유저 ID',
  })
  _id: string;
}
