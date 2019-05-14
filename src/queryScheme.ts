
import {parseStringToTable, parseStringToProperty, newTable, newProperty, clone} from '@chego/chego-tools';
import { QuerySyntaxEnum, Property, Table, StringOrProperty, IQueryScheme, IQuerySchemeArray, QuerySchemeEntry } from '@chego/chego-api';
import { newQuerySchemeElement } from './querySchemeElement';

const parsers = new Map<QuerySyntaxEnum, (value:string, index:number)=>Property | Table>([
    [QuerySyntaxEnum.From, (value:string) => parseStringToTable(value)],
    [QuerySyntaxEnum.To, (value:string) => parseStringToTable(value)],
    [QuerySyntaxEnum.Update, (value:string) => parseStringToTable(value)],
    [QuerySyntaxEnum.Select, (value:string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Delete, (value:string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Where, (value:string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Having, (value:string) => parseStringToProperty(value)],
]);


const parseStringIfRequired = (type: QuerySyntaxEnum) => (keys: any[], data: any, i: number) => {
    keys.push(
        (typeof data === 'string')
            ? parsers.has(type) 
                ? parsers.get(type)(data, i)
                : data
            : data);
    return keys;
}

const parseJoinOnParams = (tableName:string, property:StringOrProperty) => {
    const table:Table = newTable(tableName);
    if(typeof property === 'string') {
        return [newProperty({table, name:property})];
    }
    property.table = table;

    return [property];
}

export const newQueryScheme = ():IQueryScheme => {
    const pSchemeArr:IQuerySchemeArray = [];
    return {
        add(type:QuerySyntaxEnum, ...args:any[]):void {
            const params:any[] = (type === QuerySyntaxEnum.Join || type === QuerySyntaxEnum.On) 
                ? parseJoinOnParams(args[0], args[1])
                : args.reduce(parseStringIfRequired(type), []);
            pSchemeArr.push(newQuerySchemeElement(pSchemeArr.length, type, params));
        },
        get(index:number):QuerySchemeEntry {
            return index < 0 ? pSchemeArr[pSchemeArr.length + index] : pSchemeArr[index];
        },
        toArray():IQuerySchemeArray {
            return clone(pSchemeArr);
        }
    }
}