import { parseStringToProperty, newProperty, isTableDotKeyString, newTable, newLogicalOperatorScope } from '@chego/chego-tools';
import {StringOrProperty, FunctionData, Property, QuerySyntaxEnum, PropertyOrLogicalOperatorScope, LogicalOperatorScope, AnyButFunction} from '@chego/chego-api';

export const rowId = (alias: string = 'id'): Property => {
    const property: Property = newProperty({ type: QuerySyntaxEnum.RowId });
    if (isTableDotKeyString(alias)) {
        const data: string[] = alias.split('.');
        property.table = newTable(data[0]);
        property.alias = data[1];
    } else {
        property.alias = alias;
    }
    return property;
}
export const alias = (name: string, alias: string): Property => {
    const property: Property = parseStringToProperty(name);
    property.alias = alias;
    property.type = QuerySyntaxEnum.Alias;
    return property;
}

const parseStringToPropertyIfRequired = (key: StringOrProperty) => typeof key === 'string' ? parseStringToProperty(key) : key;

export const greatest = (keys: StringOrProperty[], alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Greatest,
    properties: keys.reduce((result: Property[], key: StringOrProperty) => (result.push(parseStringToPropertyIfRequired(key)), result), []),
    alias: (alias ? alias : `GREATEST(${keys.join(',')})`)
});
export const least = (keys: StringOrProperty[], alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Least,
    properties: keys.reduce((result: Property[], key: StringOrProperty) => (result.push(parseStringToPropertyIfRequired(key)), result), []),
    alias: (alias ? alias : `LEAST(${keys.join(',')})`)
});
export const coalesce = (keys: StringOrProperty[], alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Coalesce,
    properties: keys.reduce((result: Property[], key: StringOrProperty) => (result.push(parseStringToPropertyIfRequired(key)), result), []),
    alias: (alias ? alias : `COALESCE(${keys.join(',')})`)
});
export const count = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Count,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `COUNT(${key})`)
});
export const max = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Max,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `MAX(${key})`)
});
export const min = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Min,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `MIN(${key})`)
});
export const sum = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Sum,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `SUM(${key})`)
});
export const avg = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Avg,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `AVG(${key})`)
});
export const sqrt = (key: StringOrProperty, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Sqrt,
    properties: [parseStringToPropertyIfRequired(key)],
    alias: (alias ? alias : `SQRT(${key})`)
});
export const pow = (key: StringOrProperty, exponent: number, alias?: string): FunctionData => ({
    type: QuerySyntaxEnum.Pow,
    properties: [parseStringToPropertyIfRequired(key)],
    exponent,
    alias: (alias ? alias : `POW(${key})`)
});

const ifStringThenParseToProperty = (keys: PropertyOrLogicalOperatorScope[], key: any): PropertyOrLogicalOperatorScope[] =>
    keys.concat((typeof key === 'string') ? parseStringToProperty(key) : key);

export const or = (...properties: AnyButFunction[]) => {
    const list:PropertyOrLogicalOperatorScope[] = (<PropertyOrLogicalOperatorScope[]>properties).reduce(ifStringThenParseToProperty, [])
    return newLogicalOperatorScope(QuerySyntaxEnum.Or, list);
}
export const and = (...properties: AnyButFunction[]) => {
    const list:PropertyOrLogicalOperatorScope[] = (<PropertyOrLogicalOperatorScope[]>properties).reduce(ifStringThenParseToProperty, [])
    return newLogicalOperatorScope(QuerySyntaxEnum.And, list);
}