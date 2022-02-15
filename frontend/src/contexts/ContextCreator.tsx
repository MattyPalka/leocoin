import type { FC } from 'react';
import { createContext, useContext } from 'react';

type ContextType<T> = [useConsumer: ConsumerType<T>, Provider: FC];
type ConsumerType<T> = () => T;
type Hook<T> = () => T;

export const makeContext = function makeContext<T>(contextHook: Hook<T>): ContextType<T> {
  const Context = createContext<T>({} as T);
  const Provider: FC = ({ ...rest }) => <Context.Provider value={contextHook()} {...rest} />;
  const useConsumer = (): T => useContext(Context);

  return [useConsumer, Provider];
};
