import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse, GetUserListResponse } from './dto';

@ApiTags('유저')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ operationId: '유저 생성' })
  @ApiCreatedResponse({ description: '성공', type: CreateUserResponse })
  @Post()
  async create(@Body() body: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.create(body);
  }

  @ApiOperation({ operationId: '유저 목록 조회' })
  @ApiOkResponse({ description: '성공', type: GetUserListResponse })
  @Get()
  async list(): Promise<GetUserListResponse> {
    return this.userService.findAll();
  }
}