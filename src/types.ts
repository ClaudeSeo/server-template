import { SetOptional } from 'type-fest';

type KeyType = string | number | symbol;

export type CreateDocument<
  T,
  K extends keyof T = Extract<keyof T, KeyType>
> = SetOptional<T, K>;
