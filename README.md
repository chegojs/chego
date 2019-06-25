# chego

Chego is a lightweight Javascript library written in TypeScript. 
The goal of this project is to provide tools to create an easy-to-use, portable, and readable code of database application. 
All the magic is just using one of the defined database drivers and its config. The rest of the code is independent of the selected database type.

Currently supports: [MySQL](https://github.com/chegojs/chego-mysql), [Firebase](https://github.com/chegojs/chego-firebase), [MongoDB](https://github.com/chegojs/chego-mongodb)

## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Tips](#tips)
    * [Choosing columns/properties](#choosing-columns/properties)
    * [Selecting from multiple tables](#Selecting-from-multiple-tables)
    * [Using `table.key` pattern](#Using-table.key-pattern)
    * [Multiple properties in `where` clause](#Multiple-properties-in-where-clause)
    * [Use `and()` and `or()` helpers](#use-and()-and-or()-helpers)
    * [Nesting `LogicalOperatorScope` objects](#Nesting-LogicalOperatorScope-objects)
    * [Logical operators](#Logical-operators)
    * [Grouping results](#Grouping-results)
    * [Sorting results](#Sorting-results)
    * [Alias expression](#Alias-expression)
    * [Wrapping query parts](#Wrapping-query-parts)
    * [Testing subqueries with `Exists` operator](#Testing-subqueries-with-Exists-operator)
    * [Setting filter condition for groups of rows with `Having` clause](#Setting-filter-condition-for-groups-of-rows-with-Having-clause)
    * [Unions](#unions)
    * [Checking if specified value matches any value with `In` operator](#Checking-if-specified-value-matches-any-value-with-In-operator)
    * [Testing values with `Like` operator](#Testing-values-with-Like-operator)
* [API](#api)
    * [`IChego`](#ichego)
    * [`IQuery`](#iquery)
* [Primary functions](#primary-functions)
    * [`newChego`](#newChego)
    * [`newQuery`](#newQuery)
* [Helpers](#helpers)
    * [`rowId`](#rowId)
    * [`alias`](#alias)
    * [`and/or`](#and/or)
* [MySQL functions](#mysql-functions)
* [Examples](#examples)
    * [Selecting data](#Selecting-data)
    * [Updating data](#Updating-data)
    * [Removing rows](#Removing-rows)
    * [Inserting data](#Inserting-data)
    * [Joining queries](#Joining-queries)
    * [Like](#Like)
    * [Unions](#Unions)
    * [In](#In)
    * [Having](#Having)
    * [Exists](#Exists)
* [Contribute](#Contribute)
* [License](#License)

## Install
```
npm install --save @chego/chego
```

## Usage

Usage is very simple once you decide which type of database you want to use, just pass it to `newChego()` function with its config and voila! You can create queries with `newQuery` and execute them using `chego` object.

```
const { newChego, newQuery } = require("@chego/chego");
const { <databaseDriver> } = require("@chego/chego-<database>");

const chego = newChego(<databaseDriver> ,{ 
    ...database config... 
});
const query = newQuery().select('*').from('superheroes','villains').where('origin').is.eq('Gotham City').limit(10);

await chego.connect();

chego.execute(query)
.then(result => { 
    console.log('RESULT:', JSON.stringify(result));
    chego.disconnect();
})
.catch(error => { 
    console.log('ERROR:', error);
    chego.disconnect();
});

```

## Tips

#### Choosing columns/properties
```
select().from('superheroes'); // selects all columns/properties
select('*').from('superheroes'); // selects all columns/properties
select('name', 'origin').from('superheroes'); // selects only 'name' and 'origin'
```
#### Selecting from multiple tables
```
select().from('superheroes','villains') ...
``` 

#### Using `table.key` pattern
If you are referring to different tables in your query - in non MySQL database. It's better to use the `table.key` patteny then. This will save time and trouble, as any property without a defined table, will be filled with the first table defined in the `from` clause - in the further stage of processing the query.

In single table queries or MySQL driver this is not an issue but in other cases, you should consider using it.
```
select().from('superheroes','villains').where('superheroes.name')
```

#### Multiple properties in `where` clause
By default all properties in `where` clause are wrapped with `and()`.
```
where('name', 'foo', 'bar')
// will become in the further stage of processing the query
where(and('name', 'foo', 'bar'))
```

#### Use `and()` and `or()` helpers
With `and()` and `or()` helpers you can sinplify your queries
```
where(or('foo','bar')).are.eq(1) === where('foo').or.where('bar').are.eq(1)

where(and('foo','bar')).are.eq(or(1,2)) === where('foo').and.where('bar').are.eq(1).or.eq(2)
```

#### Nesting `LogicalOperatorScope` objects
It is possible to create `LogicalOperatorScope` objects inside another `LogicalOperatorScope` object, which allows you to use more complex conditions.
```
where(and('foo', or('bar','baz'))).are.eq('cool')
// will be parsed to
(foo === 'cool' && (bar === 'cool' || baz === 'cool'))
```

#### Logical operators
Write queries the way you want.
```
// query with logical operator
query.select('*').from('comics').where('writer').is.eq('Stan Lee', or('Bob Kane'));

// query without logical operator
query.select('*').from('comics').where('writer').is.eq('Stan Lee').or.is.eq('Bob Kane');
```
Use logical operators to simplify your queries.
```
// query with logical operator
query.select('*').from('comics').where('writer', or('editor')).is.eq('Stan Lee');

// queries without logical operator
query.select('*').from('comics').where('writer').or.where('editor').are.eq('Stan Lee');

query.select('*').from('comics').where('writer').is.eq('Stan Lee').or.where('editor').is.eq('Stan Lee');
```

#### Grouping results
Like in *MySQL* the `groupBy` clause groups a set of rows into a set of summary rows by values of columns. It returns one row for each group. Also like in *MySQL* it is possible to sort the groups in ascending or descending orders.

The default sort order is set in ascending order.
```
groupBy('foo ASC')
// or
groupBy('foo')

// multiple values
groupBy('foo DESC', 'bar ASC', 'baz')
```

#### Sorting results
Like in *MySQL* it is possible to sort a query results by a single column or multiple columns in ascending or descending order.
```
orderBy('foo ASC')
// or
orderBy('foo')

// multiple values
orderBy('foo DESC', 'bar ASC', 'baz')
```
#### Alias expression
It is possible to create `alias` property with *"alias expression"* (`'<key> AS <alias>'`).
```
query.select('alterEgo AS knownAs').from('superheroes');
```
Although using *"alias expression"* is less efficient because in the end it is parsed to `alias` property.

#### Wrapping query parts
`Chego` API contains a specific `inParentheses()` clause. You can use it to place selected parts of the query in parentheses. It has been implemented for complex conditions.
```
query.select('name').from('superheroes').where('origin').is.equalTo('New York City').and.inParentheses(
    (query) => query.where('teamAffiliation').is.equalTo("Avengers")
    .or.where('teamAffiliation').is.equalTo('Defenders')
).limit(10)

// conditions formula
// (origin === 'New York City' && (teamAffiliation === 'Avengers' || teamAffiliation === 'Defenders'))
```

#### Running multiple queries in one call
You can pass a set of queries and execute them synchronously in one call, but will return results only from the last query. For this reason, you should not combine the `SELECT` query set. This function has been designed to run `transactions` in` chego-mysql`. In `firebase` it is only synchronized calls without the possibility of rollback in case of failure of one of the queries.
```
...
const query1 = newQuery().insert({
            name: "Thanos",
            alterEgo: "",
            origin: "Titan",
            publisher: "mcUT642",
            createdBy: [
                "jsTR612"
            ],
            firstAppearance: "tiIM771"
        }).to('villains');
        
const query2 = newQuery().select('*').from('villains').limit(10);

chego.execute(query1, query2)
.then(result => { 
   ...
})
.catch(error => { 
    ...
});
```
#### Testing subqueries with `Exists` operator

The *MySQL EXISTS* operator is a Boolean operator that returns either true or false. The *EXISTS* operator is often used the in a subquery to test for an *exist* condition.
    
More information about *MySQL EXISTS* operator can be found [here](http://www.mysqltutorial.org/mysql-exists/)

#### Setting filter condition for groups of rows with `Having` clause

The `having` clause is often used with the `groupBy` clause to filter groups based on a specified condition. More information about *MySQL HAVING* clause can be found [here](http://www.mysqltutorial.org/mysql-having.aspx). In `chego`, `having` clause is available only as a succession of the `groupBy` clause.

#### Unions

Known from *MySQL UNION* operator allows you to combine two or more result sets of queries into a single result set. `Chego` API contains two union methods: 
* `union`: which imitates *MySQLs* `UNION DISTINCT` default `UNION`
* `unionAll`: which imitates *MySQLs* `UNION ALL`

More information about *MySQL UNION* operator can be found [here](http://www.mysqltutorial.org/sql-union-mysql.aspx)

#### Checking if specified value matches any value with `In` operator

The *MySQL IN*  operator allows you to determine if a specified value matches any value in a set of values or returned by a subquery. More information about *MySQL IN* operator can be found [here](http://www.mysqltutorial.org/sql-in.aspx)

#### Testing values with `Like` operator

The *MySQL LIKE* operator is a logical operator that tests whether a string contains a specified pattern or not. MySQL provides two wildcard characters for constructing patterns: percentage `%` and underscore `_`.
* The percentage ( % ) wildcard matches any string of zero or more characters.
* The underscore ( _ ) wildcard matches any single character.

More information about *MySQL LIKE* operator can be found [here](http://www.mysqltutorial.org/mysql-like/)

## API

#### `IChego`
`execute(...queries: IQuery[]): Promise<any>` - uses defined database driver to parse and execute given queries. It returns `Promise` with query results or `Error`.

`connect(): Promise<any>` - establishes a connection.

`disconnect(): Promise<any>` - terminates a connection.

#### `IQuery`
It extends `IQueryMethods` to provide fluent interface for builder. More details can be found [here](https://github.com/chegojs/chego-api/blob/master/src/interfaces.ts#L9).

`scheme: IQueryScheme` - returns query scheme object. More details can be found [here](https://github.com/chegojs/chego-api/blob/master/src/interfaces.ts#L9).

## Primary functions

#### `newChego`
```
newChego(driver:Fn, config:object): IChego
```
Initializes database driver and returns new `Chego` object.

#### `newQuery`
```
newQuery(): IQuery
```
Returns new query scheme builder.

## Helpers

#### `rowId`
```
rowId(table?:string, alias?: string): Property
```
Some NoSQL data stores do not contain a primary key inside records. With `rowId` you can get the record key and attach it to the schema. You can also search / filter records by primary key.

The default value for the argument `alias` is `'id'`

The default `table` is the first table used in clause `to()`, `update()` or `from()`. You will need to define `table`, if you want to use a primary keys from different tables in your query.

In the `on()` clause, rowId has a default value for the table argument, which is valid for `keyA` or `keyB`.

```
query.select('*').from('superheroes').where('publisher').is.eq((query) => { query.select(rowId()).from('publishers').where('name').is.eq('Marvel Comics') });
```

#### `alias`
```
alias(name: string, alias: string): Property
```
It is used to give the property a temporary name.

```
query.select(alias('alterEgo', 'knownAs')).from('superheroes');
```

#### `and/or`
```
and/or(...properties: AnyButFunction[]): LogicalOperatorScope
```
Creates new logical operator scope, which means that all given properties will be set in an "scope" array. In the further stage of processing the query, this array is parsed - with given values - to conditional expression.
```
where(or('foo', 'bar')).is.eq(1)
// will be parsed to
(foo === 1 || bar === 1)
```

`and()`, `or()` can be used in the `where` clause and within the conditions: `eq`, `lt` and` gt`.


## MySQL Functions

In `Chego` you can use some of the functions - [list](https://github.com/chegojs/chego/blob/master/MYSQL_FUNCTIONS.md) - known from MySQL. 

## Examples

#### Selecting data
```
query.select('title', 'nr).from('comics').orderBy('published DESC');
```
#### Updating data
```
query.update('superheroes').set({superPowers:[]}).where('name').is.eq('Punisher');
```
#### Removing rows
```
query.delete().from('villains').where('origin').is.not.eq('Gotham City');
```
#### Inserting data
```
query.insert({
    name: "Batman",
            alterEgo: "Bruce Wayne",
            origin: "Gotham City",
            publisher: "dcZP373",
            createdBy: [
                "bkOO872",
                "bfOU542"
            ],
            firstAppearance: "acUW996"
},{
    name: "Spiderman",
            alterEgo: "Peter Benjamin Parker",
            origin: "New York City",
            publisher: "mcUT642",
            createdBy: [
                "plTW543",
                "ghIO920"
            ],
            firstAppearance: "afUQ256"
}).to('superheroes');
```

#### Nested queries
```
query.select('*').from('superheroes').where('publisher').is.eq(
    (query) => query.select('id').from('publishers')
    .where('name').is.eq('Marvel Comics')
).limit(100);
```

#### Joining queries
```
// join
query.select('*').from('comics').join('publishers').on('publishers.id', 'comics.publisher').limit(10);
// left join
query.select('*').from('comics').leftJoin('publishers').on('publishers.id', 'comics.publisher').limit(10);
// right join
query.select('*').from('comics').rightJoin('publishers').on('publishers.id', 'comics.publisher').limit(10);
// full join
query.select('*').from('comics').fullJoin('publishers').on('publishers.id', 'comics.publisher').limit(10);

// using
query.select('*').from('superheroes').join('villains').using('id').limit(10);
```
#### Like
```
// like
query.select('*').from('superheroes').where('name').is.like('%man'); // Batman, Superman ...
query.select('*').from('superheroes').where('name').is.like('Iron%'); // Ironman, Iron fist ...
query.select('*').from('superheroes').where('name').is.like('Hu__'); // Hulk
query.select('*').from('superheroes').where('name').is.like('S%n'); // Spiderman, Superman ...

// not like
query.select('*').from('superheroes').where('name').is.not.like('%man'); // Batman, Superman ...
```

#### Unions
```
// union - distinct
query.select('name').from('superheroes').union((q)=>q.select('name).from('villains'));
// union - all
query.select('name').from('superheroes').unionAll((q)=>q.select('name).from('villains'));
```

#### In
```
// in
query.select('*').from('publishers').where('country').is.in('US');
// not in
query.select('*').from('publishers').where('country').is.not.in('US');
```

#### Having
```
// having
query.select('*').from('superheroes').groupBy('origin').having('superpowers').like('%flying%');
// not having
query.select('*').from('superheroes').groupBy('origin').having('superpowers').not.like('%flying%');
```

#### Exists
```
// exists
query.select('*').from('superheroes').where('publisher').exists(
    (query) => query.select('id').from('publishers')
    .where('name').is.eq('Marvel Comics')
);
// not exists
query.select('*').from('superheroes').where('publisher').not.exists(
    (query) => query.select('id').from('publishers')
    .where('name').is.eq('Marvel Comics')
);
```

## Contribute
There is still a lot to do, so if you want to be part of the Chego project and make it better, it's great.
Whether you find a bug or have a feature request, please contact us. With your help, we'll make it a great tool.

[How to contribute](https://github.com/orgs/chegojs/chego/CONTRIBUTING.md)

Follow our kanban boards to be up to date

[Kanban boards](https://github.com/orgs/chegojs/projects/1)

Join the team, feel free to catch any task or suggest a new one.

## License

Copyright (c) 2019 [Chego Team](https://github.com/orgs/chegojs/people)

Licensed under the [MIT license](LICENSE).
