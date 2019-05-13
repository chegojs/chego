# chego

Chego is a lightweight Javascript library written in TypeScript. 
The goal of this project is to provide tools to create an easy-to-use, portable, and readable code of database application. 
All the magic is just using one of the defined database drivers and its config. The rest of the code is independent of the selected database type.

## Install
```
npm install --save @chego/chego
```

## Usage

Usage is very simple once you decide which type of database you want to use, just pass it to `newChego()` function with its config and voila! You can create queries with `newQuery` and execute them using `chego` object.

```
//with firebase
const { newChego, newQuery } = require("@chego/chego");
const { chegoFirebase } = require("@chego/chego-firebase");
const chego = newChego(chegoFirebase ,{ ...firebase config... });
const query = newQuery().select('*').from('superheroes','villains').where('origin').is.eq('Gotham City').limit(10);

chego.connect();

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
It is possible to define more tables in `from` clause, simply add each after the comma.
```
select().from('superheroes','villains') ...
``` 
This will perform basic `JOIN`

#### Using `table.key` pattern
If you are referring to different tables in your query - in non MySQL database. It's better to use the `table.key` patteny then. This will save time and trouble, as any property without a defined table, will be filled with the first table defined in the `from` clause - in the further stage of processing the query.

In single table queries or MySQL driver this is not an issue but in other cases, you should consider using it.
```
select().from('superheroes','villains').where('superheroes.name')
```

#### Multiple properties in `where` clause
By default all none `LogicalOperatorScope` properties are wrapped with `and()` in `where` clause. It has been designed this way because it seems to be a natural behavior.
```
where('name', 'foo', 'bar', or('baz')) 
// will become in the further stage of processing the query
where('name', and('foo'), and('bar'), or('baz'))
```

#### Nesting `LogicalOperatorScope` objects
It is possible to create `LogicalOperatorScope` objects inside another `LogicalOperatorScope` object, which allows you to use more complex conditions.
```
where('foo', and('bar', or('baz'))).are.eq('cool')
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
`Chego` API contains a specific `wrapped()` clause. You can use it to place selected parts of the query in parentheses. It has been implemented for complex conditions.
```
query.select('name').from('superheroes').where('origin').is.equalTo('New York City').and.wrapped(
    (query) => query.where('teamAffiliation').is.equalTo("Avengers")
    .or.where('teamAffiliation').is.equalTo('Defenders')
).limit(10)

// conditions formula
// (origin === 'New York City' && (teamAffiliation === 'Avengers' || teamAffiliation === 'Defenders'))
```


## API

#### `IChego`
`execute(...queries: IQuery[]): Promise<any>` - uses defined database driver to parse and execute given queries. It returns `Promise` with query results `object` or `Error`.
`connect(callback?:Fn): void` - establishes a connection. Additionally, you can specify a custom callback which will be triggered when the connection is established.
`disconnect(callback?:Fn): void` - terminates a connection. Additionally, you can specify a custom callback that will be triggered when the connection is closed.

#### `IQuery`
It extends `IQueryMethods` to provide fluent interface for builder. More details can be found [here](https://github.com/chegojs/chego-api/blob/master/src/interfaces.ts#L9).

`scheme: IQueryScheme` - returns query scheme object. More details can be found [here](https://github.com/chegojs/chego-api/blob/master/src/interfaces.ts#L9).

## Primary functions

#### `newChego(driver:Fn, config:object): IChego`
Initializes database driver and returns new `Chego` object.

#### `newQuery(): IQuery`
Returns new query scheme builder.

## Helpers

#### `rowId(alias: string = 'id'): Property`
It is used to get primary key - if it is not included in the row scheme as in NoSQL data stores.

```
query.select('*').from('superheroes').where('publisher').is.eq((query) => { query.select(rowId()).from('publishers').where('name').is.eq('Marvel Comics') });
```

#### `alias(name: string, alias: string): Property`
It is used to give the property a temporary name.

```
query.select(alias('alterEgo', 'knownAs')).from('superheroes');
```

#### `and/or(...properties: AnyButFunction[]): LogicalOperatorScope`
Creates new logical operator scope, which means that all given properties will be set in an "scope" array. In the further stage of processing the query, this array is parsed - with given values - to conditional expression.
```
where('foo', or('bar')).is.eq(1)
// will be parsed to
(foo === 1 || bar === 1)
```

`and()`, `or()` can be used in the `where` clause and within the conditions: `eq`, `lt` and` gt`.


### MySQL Comparison, Aggregate and Math Functions

In Chego you can use some of the functions known from MySQL.

#### `greatest(keys: StringOrProperty[], alias?: string): FunctionData`
With two or more arguments, returns the maximum-valued argument. 

Default alias is `GREATEST()`
```
select(greatest([1,3,5,88,2])) ...
```

#### `least(keys: StringOrProperty[], alias?: string): FunctionData`
Returns the smallest value of the list of given arguments.

Default alias is `LEAST()`
```
select(least([1,2,3,4,5,6)) ...
```

#### `coalesce(keys: StringOrProperty[], alias?: string): FunctionData`
Returns the first non-NULL argument. In case all arguments are NULL, the COALESCE function returns NULL.

Default alias is `COALESCE()`
```
select(coalesce(['foo','bar'])) ...
```

#### `count(key: StringOrProperty, alias?: string): FunctionData`
Returns the number of rows in a table.

Default alias is `COUNT()`
```
select(count(['publishers'])) ...
```

#### `max(key: StringOrProperty, alias?: string): FunctionData`
Returns the maximum value in a set of values.

Default alias is `MAX()`
```
select(max(['points'])) ...
```

#### `min(key: StringOrProperty, alias?: string): FunctionData`
Returns the minimum value in a set of values.

Default alias is `MIN()`
```
select(min(['points'])) ...
```

#### `sum(key: StringOrProperty, alias?: string): FunctionData`
Returns the sum of a set of values.

Default alias is `SUM()`
```
select(sum(['points'])) ...
```

#### `avg(key: StringOrProperty, alias?: string): FunctionData`
Returns the average value of a set of values

Default alias is `AVG()`
```
select(avg(['points'])) ...
```

#### `sqrt(key: StringOrProperty, alias?: string): FunctionData`
Returns the square root of value

Default alias is `SQRT()`
```
select(sqrt(['points'])) ...
```

#### `pow(key: StringOrProperty, exponent: number, alias?: string): FunctionData`
Returns the argument raised to the specified power.

Default alias is `POW()`
```
select(pow(['points'],5)) ...
```

*Soon there will be more, the list is still growing.*

## Examples

### Selecting data
```
query.select('title', 'nr).from('comics').orderBy('published DESC');
```
### Updating data
```
query.update('superheroes').set({superPowers:[]}).where('name').is.eq('Punisher');
```
### Removing rows
```
query.delete().from('villains').where('origin').is.not.eq('Gotham City');
```
### Inserting data
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

### Nested queries
```
query.select('*').from('superheroes').where('publisher').is.eq(
    (query) => query.select('id').from('publishers')
    .where('name').is.eq('Marvel Comics')
).limit(100);
```

### Joining queries
```
// join
query.select('*').from('comics').join('publishers','id').on('comics', 'publisher').limit(10);
// left join
query.select('*').from('comics').leftJoin('publishers','id').on('comics', 'publisher').limit(10);
// right join
query.select('*').from('comics').rightJoin('publishers','id').on('comics', 'publisher').limit(10);
// full join
query.select('*').from('comics').fullJoin('publishers','id').on('comics', 'publisher').limit(10);
```

## Contribute
There is still a lot to do, so if you want to be part of the Chego project and make it better, it's great.
Whether you find a bug or have a feature request, please contact us. With your help, we'll make it a great tool.

[How to contribute](https://github.com/orgs/chegojs/chego/CONTRIBUTING.md)

Follow our kanban boards to be up to date

[Kanban boards](https://github.com/chegojs/chego/blob/master/TODO.md)

Join the team, feel free to catch any task or suggest a new one.

## License

Copyright (c) 2019 [Chego Team](https://github.com/orgs/chegojs/people)

Licensed under the [MIT license](LICENSE).
