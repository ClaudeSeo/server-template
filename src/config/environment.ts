import { ENV } from './environment.constant';

export default () => ({
  /** 실행 환경 */
  env: process.env.NODE_ENV || ENV.DEVELOPMENT,

  /** 서버 포트 */
  port: parseInt(process.env.PORT || '3000', 10),

  /** 비밀키 정보 */
  secret: {
    session: process.env.SESSION_SECRET || '',
  },
});
