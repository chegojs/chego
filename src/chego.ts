import { Fn, IChego, IQuery, IDatabaseDriver } from '@chego/chego-api';

export const newChego = (driver:Fn<any>, config:object):IChego => {
    const dbDriver:IDatabaseDriver = driver();
    dbDriver.initialize(config);

    return {
        execute: async (...queries:IQuery[]): Promise<any> => dbDriver.execute(queries),
        connect:(): Promise<any> => dbDriver.connect(),
        disconnect:(): Promise<any> => dbDriver.disconnect()
    }
}
