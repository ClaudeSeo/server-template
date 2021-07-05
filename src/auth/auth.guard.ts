import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestError, UnauthorizedError } from '~/common/error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const infoIsError = (info: any): info is Error =>
      (info instanceof Error || info?.name?.endsWith('Error')) ?? false;

    if (err && err instanceof Error) {
      throw new UnauthorizedError(err.message);
    } else if (!user && infoIsError(info)) {
      throw new UnauthorizedError(info.message);
    } else if (!user && status) {
      throw new BadRequestError('잘못된 토큰 정보입니다.');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
