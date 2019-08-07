import { parseStringToProperty, newProperty, newTable, newLogicalOperatorScope } from '@chego/chego-tools';
import {StringOrProperty, Property, QuerySyntaxEnum, PropertyOrLogicalOperatorScope, LogicalOperatorScope, AnyButFunction, ItemWithCustomId} from '@chego/chego-api';

export const rowId = (table?:string, alias?: string): Property => 
    newProperty({ type: QuerySyntaxEnum.RowId, table: table ? newTable(table) : null, alias: alias || 'id' });

export const alias = (name: string, alias: string): Property => {
    const property: Property = parseStringToProperty(name);
    property.alias = alias;
    property.type = QuerySyntaxEnum.Alias;
    return property;
}

export const parseStringToPropertyIfRequired = (key: StringOrProperty) => typeof key === 'string' ? parseStringToProperty(key) : key;
export const parseStringToTempPropertyIfRequired = (key: StringOrProperty) => typeof key === 'string' ? parseStringToProperty(key, null, true) : key;

export const ifStringThenParseToProperty = (keys: PropertyOrLogicalOperatorScope[], key: any): PropertyOrLogicalOperatorScope[] =>
    keys.concat((typeof key === 'string') ? parseStringToProperty(key) : key);

export const ifStringThenParseToTempProperty = (keys: PropertyOrLogicalOperatorScope[], key: any): PropertyOrLogicalOperatorScope[] =>
    keys.concat((typeof key === 'string') ? parseStringToProperty(key, null, true) : key);

export const or = (...properties: AnyButFunction[]): LogicalOperatorScope => {
    const list:PropertyOrLogicalOperatorScope[] = (<PropertyOrLogicalOperatorScope[]>properties).reduce(ifStringThenParseToProperty, [])
    return newLogicalOperatorScope(QuerySyntaxEnum.Or, list);
}
export const and = (...properties: AnyButFunction[]): LogicalOperatorScope => {
    const list:PropertyOrLogicalOperatorScope[] = (<PropertyOrLogicalOperatorScope[]>properties).reduce(ifStringThenParseToProperty, [])
    return newLogicalOperatorScope(QuerySyntaxEnum.And, list);
}

export const withCustomId = (id:string, item:object):ItemWithCustomId => ({ id, item, type:QuerySyntaxEnum.ItemWithCustomId });