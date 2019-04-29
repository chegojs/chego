import { QuerySyntaxEnum, IQuerySchemeElement } from '@chego/chego-api';


export const newQuerySchemeElement = (index:number, type:QuerySyntaxEnum, params?:any[]):IQuerySchemeElement => ({
    index,
    type,
    params
});
