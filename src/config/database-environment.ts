export default () => ({
  /** 메인 데이터베이스 */
  main: {
    uri: process.env.MAIN_DB_URI ?? 'mongodb://127.0.0.1:27017/main-dev',
    useNewUrlParser: true,
    poolSize: Number(process.env.MAIN_DB_POOL_SIZE ?? '5'),
    autoIndex: false,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
});
