import { IQuery, IQueryScheme, QuerySyntaxEnum, IQueryNot, IQueryEqualTo, IQueryLike, IQueryGT, IQueryLT, IQueryBetween, IQueryWhere, IQueryWrapped, IQueryNull, IQueryOrder, IQueryLimit, IQueryAnd, IQueryOr, Fn, IQueryAndWhere, IQueryOrWhere, IQueryLeftJoin, IQueryRightJoin, IQueryJoin, IQueryFullJoin, IQueryTo, IQueryGroupBy, IQueryIs, IQueryAre, IQuerySet, IQueryFrom, StringOrProperty, CommandProp, IQueryWhereExists, IQueryUnion, IQuerySelect, QueryBuildFunction, IQueryOn } from '@chego/chego-api';
import { isQueryScheme, newQueryScheme } from './queryScheme';
import { isFunction } from '@chego/chego-tools';

const containsQueryScheme = (obj: any): obj is IQuery =>
    isQueryScheme((<IQuery>obj).scheme);

export const newQuery = (): IQuery => {
    let pScheme: IQueryScheme = newQueryScheme();
    const add = (type: QuerySyntaxEnum, ...args: any[]): void => {
        const arg0 = args.length && args[0];
        if (isFunction(arg0)) {
            if (type === QuerySyntaxEnum.WrapInParentheses) {
                pScheme.add(QuerySyntaxEnum.OpenParentheses);
                arg0(query);
                pScheme.add(QuerySyntaxEnum.CloseParentheses);
            } else {
                const temp = pScheme;
                pScheme = newQueryScheme();
                arg0(query);
                temp.add(type, pScheme);
                pScheme = temp;
            }
        } else if (containsQueryScheme(arg0)) {
            pScheme.add(type, arg0.scheme);
        } else {
            pScheme.add(type, ...args);
        }
    }
    const query: IQuery = {
        get scheme(): IQueryScheme {
            return pScheme;
        },
        get or(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryWhere & IQueryWrapped {
            add(QuerySyntaxEnum.Or);
            return query;
        },
        get not(): IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryNull {
            add(QuerySyntaxEnum.Not);
            return query;
        },
        get is(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryNull {
            add(QuerySyntaxEnum.Is);
            return query;
        },
        get and(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryWhere & IQueryWrapped {
            add(QuerySyntaxEnum.And);
            return query;
        },
        get are(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryNull {
            add(QuerySyntaxEnum.Are);
            return query;
        },
        get null(): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Null);
            return query;
        },
        whereExists(fn: Fn): IQueryOrder & IQueryLimit & IQueryAndWhere & IQueryOrWhere {
            add(QuerySyntaxEnum.Exists, fn);
            return query;
        },
        to(...tables: string[]): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrder & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.To, ...tables);
            return query;
        },
        set(data: any): IQueryOrder & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.Set, data);
            return query;
        },
        insert(...args: any[]): IQueryTo {
            add(QuerySyntaxEnum.Insert, ...args);
            return query;
        },
        where(...values: any[]): IQueryGroupBy & IQueryIs & IQueryAre & IQueryOrWhere & IQueryAndWhere {
            add(QuerySyntaxEnum.Where, ...values);
            return query;
        },
        update(...tables: any[]): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQuerySet {
            add(QuerySyntaxEnum.Update, ...tables);
            return query;
        },
        select(...args: string[]): IQueryFrom {
            add(QuerySyntaxEnum.Select, ...args);
            return query;
        },
        delete(...args: string[]): IQueryFrom {
            add(QuerySyntaxEnum.Delete, ...args);
            return query;
        },
        orderBy(...values: StringOrProperty[]): IQueryWhere & IQueryLimit {
            add(QuerySyntaxEnum.OrderBy, ...values);
            return query;
        },
        lt(value: CommandProp<IQuery>): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.LT, value);
            return query;
        },
        limit(offsetOrCount: number, count?: number): IQueryWhere & IQueryOrder {
            add(QuerySyntaxEnum.Limit, offsetOrCount, count);
            return query;
        },
        like(value: CommandProp<IQuery>): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Like, value);
            return query;
        },
        gt(value: CommandProp<IQuery>): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.GT, value);
            return query;
        },
        eq(value: CommandProp<IQuery>): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.EQ, value);
            return query;
        },
        between(min: number, max: number): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Between, min, max);
            return query;
        },
        from(...tables: string[]): IQueryGroupBy & IQueryWhereExists & IQueryUnion & IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrder & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.From, ...tables);
            return query;
        },
        union(all: boolean): IQuerySelect {
            add(QuerySyntaxEnum.Union, all);
            return query;
        },
        wrapped(fn: QueryBuildFunction<IQuery>): IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.WrapInParentheses, fn);
            return query;
        },
        on(table: string, key: string): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrder & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.On, table, key);
            return query;
        },
        leftJoin(table: string, key: string): IQueryOn {
            add(QuerySyntaxEnum.LeftJoin, table, key);
            return query;
        },
        rightJoin(table: string, key: string): IQueryOn {
            add(QuerySyntaxEnum.RightJoin, table, key);
            return query;
        },
        join(table: string, key: string): IQueryOn {
            add(QuerySyntaxEnum.Join, table, key);
            return query;
        },
        fullJoin(table: string, key: string): IQueryOn {
            add(QuerySyntaxEnum.FullJoin, table, key);
            return query;
        },
        groupBy(...values: StringOrProperty[]): IQueryWhere & IQueryOrder & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.GroupBy, ...values);
            return query;
        }
    }

    return query;
}