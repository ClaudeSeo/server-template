export const VALIDATION_MESSAGE = {
  REQUIRED_USER_NAME: '이름(`name`) 이 누락되었습니다.',

  REQUIRED_EMAIL: '이메일(`email`) 이 누락되었습니다.',
  INVALID_EMAIL_FORMAT: '이메일(`email`) 형식이 아닙니다.',

  REQUIRED_PASSWORD: '비밀번호(`password`) 이 누락되었습니다.',

  INVALID_BIRTH_DATE_FORMAT:
    '생년월일(`birthDate)` 는 `yyyy-MM-dd` 형식이어야 합니다.',

  REQUIRED_AGE: '생년월일(`birthDate)` 는 `yyyy-MM-dd` 형식이어야 합니다.',

  WRONG_TYPE_OF_AGREEMENTS: '동의서(`agreements`) 는 배열 형식이어야 합니다.',
  MIN_AGREEMENTS: '동의서(`agreements`) 는 1개 이상 값이 있어야 합니다.',

  REQUIRED_AGREEMENT_NAME: '동의서 이름 (`name`) 이 누락되었습니다.',
};

export const NOT_FOUND_USER = '사용자를 찾을 수 없습니다.';

export const DUPLICATED_USER = '이미 가입된 사용자입니다.';
