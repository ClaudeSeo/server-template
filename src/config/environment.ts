import { ENV } from './environment.constant';

export default () => ({
  /** 실행 환경 */
  env: process.env.NODE_ENV || ENV.DEVELOPMENT,

  /** 서버 포트 */
  port: parseInt(process.env.PORT || '3000', 10),

  /** 데이터베이스 접속 정보 */
  mainDatabase: {
    uri: process.env.MAIN_DB_URI ?? 'mongodb://127.0.0.1:27017/main-dev',
    useNewUrlParser: true,
    poolSize: Number(process.env.MAIN_DB_POOL_SIZE ?? '5'),
    autoIndex: false,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
});
