import { Fn, IChego, IQuery, IDatabaseDriver } from '@chego/chego-api';

export const newChego = (driver:Fn, config:object):IChego => {
    const dbDriver:IDatabaseDriver = driver();
    dbDriver.initialize(config);

    return {
        async execute(query:IQuery): Promise<any> {
            return dbDriver.execute(query);
        }
    }
}
