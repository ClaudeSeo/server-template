import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { getLoggerToken } from 'nestjs-pino';
import { UniqueError } from '~/common/error';
import { CreateUserDto } from '../../dto/user-create.dto';
import { User } from '../../schema/user.schema';
import { UserService } from '../user.service';

describe('유저 서비스', () => {
  let userService: UserService;

  let bcryptHashStub: jest.SpyInstance;
  let userModelStub: Record<string, jest.Mock>;

  let dummyUser: User;
  let dummyPassword: string;

  const initDummy = (): void => {
    dummyUser = {
      _id: Types.ObjectId('60e3151c04e1246ec2c85947'),
      name: '서테스트',
      email: 'test@g.com',
      password: '$2b$10$d9af5yT8cPFoNsddj9w5JeCnQU4cxgdX8sb.lH/BuPV92qjyhBvtW',
      createdAt: new Date('2021-07-11T00:00:00.000+09:00'),
      updatedAt: new Date('2021-07-11T00:00:00.000+09:00'),
    };

    dummyPassword =
      '$2b$10$d9af5yT8cPFoNsddj9w5JeCnQU4cxgdX8sb.lH/BuPV92qjyhBvtW';
  };

  const initStub = (): void => {
    userModelStub = {
      create: jest.fn().mockResolvedValue(dummyUser),
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      read: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    bcryptHashStub = jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => dummyPassword);
  };

  beforeEach(async () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-07-11T00:00:00.000+09:00'));
    initDummy();
    initStub();

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModelStub,
        },
        {
          provide: getLoggerToken(UserService.name),
          useFactory: () => {},
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('중복 유저 검사', () => {
    let dummyEmail: string;

    beforeEach(() => {
      dummyEmail = 'test@g.com';
    });

    it('유저를 조회해야 한다.', async () => {
      await userService.existsUser(dummyEmail);

      const expectedQuery = {
        email: 'test@g.com',
      };

      expect(userModelStub.findOne).toBeCalledWith(expectedQuery);
    });

    it('중복된 유저가 존재할 경우 에러를 반환해야 한다.', async () => {
      userModelStub.exec.mockResolvedValue(dummyUser);

      const result = userService.existsUser(dummyEmail);

      const expectedErrorMessage = '이미 가입된 사용자입니다.';

      expect(result).rejects.toThrow(new UniqueError(expectedErrorMessage));
    });
  });

  describe('유저 생성', () => {
    let userExistSpy: jest.SpyInstance;

    let dummyBody: CreateUserDto;

    beforeEach(() => {
      dummyBody = {
        name: '서테스트',
        email: 'test@g.com',
        password: '1234qwer',
        birthDate: '2000-01-01',
        agreements: [],
      };

      userExistSpy = jest.spyOn(userService, 'existsUser').mockResolvedValue();
      userModelStub.exec.mockResolvedValue(null);
    });

    it('이메일 중복 여부를 확인해야 한다 .', async () => {
      await userService.create(dummyBody);

      const expectedEmail = 'test@g.com';

      expect(userExistSpy).toBeCalledWith(expectedEmail);
    });

    it('비밀번호를 암호화 해야 한다.', async () => {
      await userService.create(dummyBody);

      const expectedPassword = '1234qwer';
      const expectedSalt = 10;

      expect(bcryptHashStub).toBeCalledWith(expectedPassword, expectedSalt);
    });

    it('유저 데이터를 생성해야 한다.', async () => {
      await userService.create(dummyBody);

      const expectedDoc = {
        email: 'test@g.com',
        name: '서테스트',
        password:
          '$2b$10$d9af5yT8cPFoNsddj9w5JeCnQU4cxgdX8sb.lH/BuPV92qjyhBvtW',
      };

      expect(userModelStub.create).toBeCalledWith(expectedDoc);
    });

    it('생성된 유저 ID를 반환해야 한다.', async () => {
      const result = await userService.create(dummyBody);

      const expectedResult = {
        _id: '60e3151c04e1246ec2c85947',
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('유저 목록 조회', () => {
    let dummyUsers: Pick<User, '_id' | 'name' | 'email'>[];

    beforeEach(() => {
      dummyUsers = [
        {
          _id: Types.ObjectId('60e3151c04e1246ec2c85947'),
          name: '테스트1',
          email: '1@g.com',
        },
        {
          _id: Types.ObjectId('60e30ca456ab825de30424a6'),
          name: '테스트2',
          email: '2@g.com',
        },
        {
          _id: Types.ObjectId('60e3084b95f0e24ecccb6627'),
          name: '테스트2',
          email: '3@g.com',
        },
      ];

      userModelStub.exec.mockResolvedValue(dummyUsers);
    });

    it('유저 목록을 조회해야 한다.', async () => {
      await userService.findAll();

      expect(userModelStub.find).toBeCalled();
    });

    it('이름과 이메일만 추출해야 한다.', async () => {
      await userService.findAll();

      const expectedFields = {
        _id: 1,
        name: 1,
        email: 1,
      };

      expect(userModelStub.select).toBeCalledWith(expectedFields);
    });

    it('목록을 반환해야 한다.', async () => {
      const result = await userService.findAll();

      const expectedResult = {
        items: [
          {
            _id: '60e3151c04e1246ec2c85947',
            name: '테스트1',
            email: '1@g.com',
          },
          {
            _id: '60e30ca456ab825de30424a6',
            name: '테스트2',
            email: '2@g.com',
          },
          {
            _id: '60e3084b95f0e24ecccb6627',
            name: '테스트2',
            email: '3@g.com',
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
