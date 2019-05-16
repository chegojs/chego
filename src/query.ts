import { IQuery, IQueryScheme, QuerySyntaxEnum, IQueryNot, IQueryEqualTo, IQueryLike, IQueryGT, IQueryLT, 
    IQueryBetween, IQueryWhere, IQueryWrapped, IQueryNull, IQueryLimit, IQueryAnd, IQueryOr, Fn, 
    IQueryAndWhere, IQueryOrWhere, IQueryLeftJoin, IQueryRightJoin, IQueryJoin, IQueryFullJoin, 
    IQueryTo, IQueryGroupBy, IQueryIs, IQueryAre, IQuerySet, IQueryFrom, StringOrProperty, IQueryUnion, 
    QueryBuildFunction, IQueryOn, CommandProp, IQueryUsing, 
    IQueryHaving, IQueryIn, IQueryExists, IQueryOrderBy, IQueryWhereNot, IQueryHavingAndLite, 
    IQueryHavingOrLite, IQueryHavingEqualTo, IQueryHavingLT, IQueryHavingGT, IQueryHavingBetween, 
    IQueryHavingNot, IQueryHavingNull, IQueryHavingWrapped, IQueryWhereIs, IQueryWhereAre } from '@chego/chego-api';
import { newQueryScheme } from './queryScheme';
import { isFunction, isQueryScheme } from '@chego/chego-tools';

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
        get null(): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Null);
            return query;
        },
        get not(): IQueryNot {
            add(QuerySyntaxEnum.Not);
            return query;
        },
        exists(fn:Fn): IQueryOrderBy & IQueryGroupBy & IQueryLimit & IQueryAndWhere & IQueryOrWhere {
            add(QuerySyntaxEnum.Exists, fn);
            return query;
        },
        to(...tables: string[]): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.To, ...tables);
            return query;
        },
        set(data: any): IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.Set, data);
            return query;
        },
        insert(...args: any[]): IQueryTo {
            add(QuerySyntaxEnum.Insert, ...args);
            return query;
        },
        where(...values: any[]): IQueryWhereIs & IQueryWhereAre & IQueryAndWhere & IQueryOrWhere & IQueryWhereNot & IQueryExists {
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
        delete(): IQueryFrom {
            add(QuerySyntaxEnum.Delete);
            return query;
        },
        orderBy(...values: StringOrProperty[]):IQueryGroupBy & IQueryLimit {
            add(QuerySyntaxEnum.OrderBy, ...values);
            return query;
        },
        lt(...values: CommandProp[]): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.LT, ...values);
            return query;
        },
        limit(offsetOrCount: number, count?: number): IQueryGroupBy & IQueryOrderBy {
            add(QuerySyntaxEnum.Limit, offsetOrCount, count);
            return query;
        },
        like(...values: CommandProp[]): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Like, ...values);
            return query;
        },
        gt(...values: CommandProp[]): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.GT, ...values);
            return query;
        },
        eq(...values: CommandProp[]): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.EQ, ...values);
            return query;
        },
        between(min: number, max: number): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.Between, min, max);
            return query;
        },
        from(...tables: CommandProp[]): IQueryGroupBy & IQueryUnion & IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.From, ...tables);
            return query;
        },
        union(...fns:Fn[]):IQueryGroupBy & IQueryOrderBy & IQueryLimit {
            add(QuerySyntaxEnum.Union, ...fns);
            return query;
        },
        unionAll(...fns:Fn[]):IQueryGroupBy & IQueryOrderBy & IQueryLimit {
            add(QuerySyntaxEnum.UnionAll, ...fns);
            return query;
        },
        wrapped(fn: QueryBuildFunction<IQuery>): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.WrapInParentheses, fn);
            return query;
        },
        on(table: string, key: string): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.On, table, key);
            return query;
        },
        using(key: string): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryWrapped {
            add(QuerySyntaxEnum.Using, key);
            return query;
        },
        leftJoin(table: string, key: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.LeftJoin, table, key);
            return query;
        },
        rightJoin(table: string, key: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.RightJoin, table, key);
            return query;
        },
        join(table: string, key: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.Join, table, key);
            return query;
        },
        fullJoin(table: string, key: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.FullJoin, table, key);
            return query;
        },
        groupBy(...values: StringOrProperty[]): IQueryOrderBy & IQueryLimit & IQueryHaving {
            add(QuerySyntaxEnum.GroupBy, ...values);
            return query;
        },
        having(...values: CommandProp[]): IQueryHavingAndLite & IQueryHavingOrLite & IQueryHavingEqualTo & IQueryHavingLT & IQueryHavingGT & IQueryHavingBetween & IQueryHavingNot & IQueryHavingNull & IQueryHavingWrapped {
            add(QuerySyntaxEnum.Having, ...values);
            return query;
        },
        in(...values:CommandProp[]): IQueryOrderBy & IQueryGroupBy & IQueryLimit & IQueryAndWhere & IQueryOrWhere {
            add(QuerySyntaxEnum.In, ...values);
            return query;
        }
    }

    return query;
}
