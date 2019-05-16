
import { parseStringToTable, parseStringToProperty, clone } from '@chego/chego-tools';
import { QuerySyntaxEnum, Property, Table, IQueryScheme, IQuerySchemeArray, QuerySchemeEntry } from '@chego/chego-api';
import { newQuerySchemeElement } from './querySchemeElement';

const parsers = new Map<QuerySyntaxEnum, (value: string, index: number) => Property | Table>([
    [QuerySyntaxEnum.From, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.To, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.Update, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.Select, (value: string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Delete, (value: string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Where, (value: string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Having, (value: string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Join, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.FullJoin, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.LeftJoin, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.RightJoin, (value: string) => parseStringToTable(value)],
    [QuerySyntaxEnum.On, (value: string) => parseStringToProperty(value)],
    [QuerySyntaxEnum.Using, (value: string) => parseStringToProperty(value)],
]);

type Parser = (value: string, index: number) => Property | Table;

const parseStringIfRequired = (parser: Parser) => (keys: any[], data: any, i: number) =>
    (keys.push(
        (typeof data === 'string' && parser)
            ? parser(data, i)
            : data), keys);

export const newQueryScheme = (): IQueryScheme => {
    const pSchemeArr: IQuerySchemeArray = [];
    return {
        add(type: QuerySyntaxEnum, ...args: any[]): void {
            const parser: Parser = parsers.get(type);
            const params: any[] = args.reduce(parseStringIfRequired(parser), []);
            pSchemeArr.push(newQuerySchemeElement(pSchemeArr.length, type, params));
        },
        get(index: number): QuerySchemeEntry {
            return index < 0 ? pSchemeArr[pSchemeArr.length + index] : pSchemeArr[index];
        },
        toArray(): IQuerySchemeArray {
            return clone(pSchemeArr);
        }
    }
}