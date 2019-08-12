import {
    IQuery, IQueryScheme, QuerySyntaxEnum, IQueryNot, IQueryEqualTo, IQueryLike, IQueryGT, IQueryLT,
    IQueryBetween, IQueryWhere, IQueryInParentheses, IQueryNull, IQueryLimit, IQueryAnd, IQueryOr, Fn,
    IQueryAndWhere, IQueryOrWhere, IQueryLeftJoin, IQueryRightJoin, IQueryJoin, IQueryFullJoin,
    IQueryTo, IQueryGroupBy, IQuerySet, IQueryFrom, StringOrProperty, IQueryUnion,
    QueryBuildFunction, IQueryOn, CommandProp, IQueryUsing,
    IQueryHaving, IQueryExists, IQueryOrderBy, IQueryWhereNot, IQueryHavingAndLite,
    IQueryHavingOrLite, IQueryHavingEqualTo, IQueryHavingLT, IQueryHavingGT, IQueryHavingBetween,
    IQueryHavingNot, IQueryHavingNull, IQueryHavingInParentheses, IQueryWhereIs, IQueryWhereAre, IQueryUnionAll, IQueryIn
} from '@chego/chego-api';
import { newQueryScheme } from './queryScheme';
import { isFunction, isQueryScheme, newCustomCondition } from '@chego/chego-tools';

const containsQueryScheme = (obj: any): obj is IQuery =>
    isQueryScheme((<IQuery>obj).scheme);

const updateScheme = (scheme: IQueryScheme, type: QuerySyntaxEnum, query: IQuery) => (arg: any) => {
    if (isFunction(arg)) {
        if (type === QuerySyntaxEnum.WrapInParentheses) {
            scheme.add(QuerySyntaxEnum.OpenParentheses);
            arg(query);
            scheme.add(QuerySyntaxEnum.CloseParentheses);
        } else if (type === QuerySyntaxEnum.Where) {
            scheme.add(type, newCustomCondition(arg, null));
        } else {
            const temp = scheme;
            scheme = newQueryScheme();
            arg(query);
            temp.add(type, scheme);
            scheme = temp;
        }
    } else if (containsQueryScheme(arg)) {
        scheme.add(type, arg.scheme);
    } else {
        scheme.add(type, arg);
    }
}

export const newQuery = (): IQuery => {
    const pScheme: IQueryScheme = newQueryScheme();
    const add = (type: QuerySyntaxEnum, ...args: any[]): void => {
        args.forEach(updateScheme(pScheme, type, query));
    }

    const query: IQuery = {
        get scheme(): IQueryScheme {
            return pScheme;
        },
        get or(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryIn & IQueryBetween & IQueryWhere & IQueryInParentheses {
            add(QuerySyntaxEnum.Or);
            return query;
        },

        get is(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryBetween & IQueryNull {
            add(QuerySyntaxEnum.Is);
            return query;
        },
        get and(): IQueryNot & IQueryEqualTo & IQueryLike & IQueryGT & IQueryLT & IQueryIn & IQueryBetween & IQueryWhere & IQueryInParentheses {
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
        exists(fn: Fn<IQuery>): IQueryOrderBy & IQueryGroupBy & IQueryLimit & IQueryAndWhere & IQueryOrWhere {
            add(QuerySyntaxEnum.Exists, fn);
            return query;
        },
        to(...tables: string[]): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryInParentheses {
            add(QuerySyntaxEnum.To, ...tables);
            return query;
        },
        set(data: any): IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryInParentheses {
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
        select(...args: any[]): IQueryFrom {
            add(QuerySyntaxEnum.Select, ...args);
            return query;
        },
        delete(): IQueryFrom {
            add(QuerySyntaxEnum.Delete);
            return query;
        },
        orderBy(...values: any[]): IQueryGroupBy & IQueryLimit {
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
        from(...tables: CommandProp[]): IQueryGroupBy & IQueryUnion & IQueryUnionAll & IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryInParentheses {
            add(QuerySyntaxEnum.From, ...tables);
            return query;
        },
        union(...fns: Array<Fn<IQuery>>): IQueryGroupBy & IQueryOrderBy & IQueryLimit {
            add(QuerySyntaxEnum.Union, ...fns);
            return query;
        },
        unionAll(...fns: Array<Fn<IQuery>>): IQueryGroupBy & IQueryOrderBy & IQueryLimit {
            add(QuerySyntaxEnum.UnionAll, ...fns);
            return query;
        },
        inParentheses(fn: QueryBuildFunction<IQuery>): IQueryGroupBy & IQueryOrderBy & IQueryLimit & IQueryAnd & IQueryOr {
            add(QuerySyntaxEnum.WrapInParentheses, fn);
            return query;
        },
        on(keyA: StringOrProperty, keyB: StringOrProperty): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryInParentheses {
            add(QuerySyntaxEnum.On, keyA, keyB);
            return query;
        },
        using(key: string): IQueryLeftJoin & IQueryRightJoin & IQueryJoin & IQueryFullJoin & IQueryOrderBy & IQueryWhere & IQueryLimit & IQueryInParentheses {
            add(QuerySyntaxEnum.Using, key);
            return query;
        },
        leftJoin(table: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.LeftJoin, table);
            return query;
        },
        rightJoin(table: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.RightJoin, table);
            return query;
        },
        join(table: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.Join, table);
            return query;
        },
        fullJoin(table: string): IQueryOn & IQueryUsing {
            add(QuerySyntaxEnum.FullJoin, table);
            return query;
        },
        groupBy(...values: any[]): IQueryOrderBy & IQueryLimit & IQueryHaving {
            add(QuerySyntaxEnum.GroupBy, ...values);
            return query;
        },
        having(...values: CommandProp[]): IQueryHavingAndLite & IQueryHavingOrLite & IQueryHavingEqualTo & IQueryHavingLT & IQueryHavingGT & IQueryHavingBetween & IQueryHavingNot & IQueryHavingNull & IQueryHavingInParentheses {
            add(QuerySyntaxEnum.Having, ...values);
            return query;
        },
        in(...values: CommandProp[]): IQueryOrderBy & IQueryGroupBy & IQueryLimit & IQueryAndWhere & IQueryOrWhere {
            add(QuerySyntaxEnum.In, ...values);
            return query;
        },
        intersect(...fns: Array<Fn<IQuery>>) {
            add(QuerySyntaxEnum.Intersect, ...fns);
            return query;
        },
        minus(...fns: Array<Fn<IQuery>>) {
            add(QuerySyntaxEnum.Minus, ...fns);
            return query;
        },
        replace(...values: CommandProp[]) {
            add(QuerySyntaxEnum.Replace, ...values);
            return query;
        }
    }

    return query;
}
