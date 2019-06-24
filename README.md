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
* [MySQL comparison, aggregate and math functions](#mysql-comparison,-aggregate-and-math-functions)
    * [`greatest`](#greatest)
    * [`least`](#least)
    * [`coalesce`](#coalesce)
    * [`count`](#count)
    * [`max`](#max)
    * [`min`](#min)
    * [`sum`](#sum)
    * [`avg`](#avg)
    * [`sqrt`](#sqrt)
    * [`pow`](#pow)
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


## MySQL Comparison, Aggregate and Math Functions

In Chego you can use some of the functions known from MySQL.

#### `greatest`
With two or more arguments, returns the maximum-valued argument. 

Default alias is `GREATEST()`
```
// greatest(keys: StringOrProperty[], alias?: string): FunctionData
select(greatest([1,3,5,88,2])) ...
```

#### `least`
Returns the smallest value of the list of given arguments.

Default alias is `LEAST()`
```
// least(keys: StringOrProperty[], alias?: string): FunctionData
select(least([1,2,3,4,5,6)) ...
```

#### `coalesce`
Returns the first non-NULL argument. In case all arguments are NULL, the COALESCE function returns NULL.

Default alias is `COALESCE()`
```
// coalesce(keys: StringOrProperty[], alias?: string): FunctionData
select(coalesce(['foo','bar'])) ...
```

#### `count`
Returns the number of rows in a table.

Default alias is `COUNT()`
```
// count(key: StringOrProperty, alias?: string): FunctionData
select(count(['publishers'])) ...
```

#### `max`
Returns the maximum value in a set of values.

Default alias is `MAX()`
```
// max(key: StringOrProperty, alias?: string): FunctionData
select(max(['points'])) ...
```

#### `min`
Returns the minimum value in a set of values.

Default alias is `MIN()`
```
// min(key: StringOrProperty, alias?: string): FunctionData
select(min(['points'])) ...
```

#### `sum`
Returns the sum of a set of values.

Default alias is `SUM()`
```
// sum(key: StringOrProperty, alias?: string): FunctionData
select(sum(['points'])) ...
```

#### `avg`
Returns the average value of a set of values

Default alias is `AVG()`
```
// avg(key: StringOrProperty, alias?: string): FunctionData
select(avg(['points'])) ...
```

#### `sqrt`
Returns the square root of value

Default alias is `SQRT()`
```
// sqrt(key: StringOrProperty, alias?: string): FunctionData
select(sqrt(['points'])) ...
```

#### `pow`
Returns the argument raised to the specified power.

Default alias is `POW()`
```
// pow(key: StringOrProperty, exponent: number, alias?: string): FunctionData
select(pow(['points'],5)) ...
```

#### `abs`
Return the absolute value of a number.

Default alias is `ABS()`
```
// abs(value: any, alias?: string): AbsData
select(abs(123.12)) ...
```

#### `acos`
Return the arc cosine of a number.

Default alias is `ACOS()`
```
// acos(value: any, alias?: string): AcosData
select(acos(0.5)) ...
```

#### `asin`
Return the arc sine of a number.

Default alias is `ASIN()`
```
// asin(value: any, alias?: string): AsinData
select(asin(0.5)) ...
```

#### `atan`
Return the arc tangent of a number.

Default alias is `ATAN()`
```
// atan(value: any, alias?: string): AtanData
select(atan(0.5)) ...
```

#### `atan2`
Return the arc tangent of two values.

Default alias is `ATAN2()`
```
// atan2(y: any, x: any, alias?: string): Atan2Data
select(atan2(0.5, 1)) ...
```

#### `ceil`
Return the smallest integer value that is greater than or equal to the number

Default alias is `CEIL()`
```
// ceil(value: any, alias?: string): CeilData
select(ceil(34.56))
```

#### `cos`
Return the cosine of a number

Default alias is `COS()`
```
// cos(value: any, alias?: string): CosData
select(cos(12)) ...
```

#### `cot`
Return the cotangent of a number

Default alias is `COT()`
```
// cot(value: any, alias?: string): CotData
select(cot(12)) ...
```

#### `degrees`
Convert the radian value into degrees

Default alias is `DEGREES()`
```
// degrees(value: any, alias?: string): DegreesData
select(degrees(1.5)) ...
```

#### `div`
Integer division

Default alias is `DIV()`
```
// div(x: any, y: any, alias?: string): DivData
select(div(4, 2)) ...
```

#### `exp`
Return e raised to the power of the number

Default alias is `EXP()`
```
// exp(value: any, alias?: string): ExpData
select(exp(1)) ...
```

#### `floor`
Return the largest integer value that is less than or equal to the number

Default alias is `FLOOR()`
```
// floor(value: any, alias?: string): FloorData
select(floor(123.456)) ...
```

#### `ln`
Return the natural logarithm of the number

Default alias is `LN()`
```
// ln(value: any, alias?: string): LnData
select(ln(4)) ...
```

#### `log`
Return the natural logarithm of the number

Default alias is `LOG()`
```
// log(value: any, alias?: string): LogData
select(log(2)) ...
```

#### `log10`
Return the base-10 logarithm of the number

Default alias is `LOG110()`
```
// log10(value: any, alias?: string): Log10Data
select(log10(2)) ...
```

#### `log2`
Return the base-2 logarithm of the number

Default alias is `LOG2()`
```
// log2(value: any, alias?: string): Log2Data
select(log2(6)) ...
```

#### `mod`
Return the remainder of x/y

Default alias is `MOD()`
```
// mod(x: any, y: any, alias?: string): ModData
select(mod(4, 2)) ...
```

#### `pi`
Return the value of PI

Default alias is `PI()`
```
// pi(alias?: string): PiData
select(pi()) ...
```

#### `radians`
Convert a degree value into radians

Default alias is `RADIANS()`
```
// radians(value: any, alias?: string): RadiansData
select(radians(125)) ...
```

#### `rand`
Return a random decimal number between 0 and 1

Default alias is `RAND()`
```
// rand(value: any, alias?: string): RandData
select(rand()) ...
```

#### `round`
Round the number to `n` decimal places

Default alias is `ROUND()`
```
// round(value: any, decimal: number, alias?: string): RoundData
select(round(123.456, 2)) ...
```

#### `sign`
Return the sign of a number

Default alias is `SIGN()`
```
// sign(value: any, alias?: string): SignData
select(sign(221.24)) ...
```

#### `sin`
Return the sine of a number

Default alias is `SIN()`
```
// sin(value: any, alias?: string): SinData
select(sin(5)) ...
```

#### `tan`
Return the tangent of a number

Default alias is `TAN()`
```
// tan(value: any, alias?: string): TanData
select(tan(1.75)) ...
```

#### `truncate`
Return a number truncated to `n` decimal places

Default alias is `TRUNCATE()`
```
// truncate(value: any, alias?: string): TruncateData
select(truncate(135.375, 2)) ...
```

#### `ascii`
Return the ASCII value of the first character in string

Default alias is `ASCII()`
```
// ascii(value: any, alias?: string): AsciiData
select(ascii("Hulk")) ...
```

#### `charLength`
Return the length of the string

Default alias is `CHAR_LENGTH()`
```
// charLength(value: any, alias?: string): CharLengthData
select(charLength("LUKE CAGE")) ...
```

#### `concat`
Add several strings together

Default alias is `CONCAT()`
```
// concat(values: any[], alias?: string): ConcatData
select(concat("Spider","-","man")) ...
```

#### `concatWs`
Add several expressions together, and add a separator between them

Default alias is `CONCAT_WS()`
```
// concatWs(separator: string, values: any[], alias?: string): ConcatWsData
select(concatWs("-", "Spider","man")) ...
```

#### `field`
Return the index position of the substring in the string list

Default alias is `FIELD()`
```
// field(search: any, values: any[], alias?: string): FieldData
select(field("Wonder", "Batgirl", "Wonderwoman", "Supergirl")) ...
```

#### `findInSet`
Search for the substring within the list of strings

Default alias is `FIND_IN_SET()`
```
// findInSet(search: any, set: string, alias?: string): FindInSetData
select(findInSet("Wonder", "Batgirl, Wonderwoman, Supergirl")) ...
```

#### `format`
Format the number as "#,###,###.##"

Default alias is `FORMAT()`
```
// format(value: any, decimal: number, alias?: string): FormatData
select(format(250500.5634, 2)) ...
```

#### `insert`
Insert the string into the another string. Replace the `n` characters

Default alias is `INSERT()`
```
// insert(value: string, position: number, length: number, toInsert: any, alias?: string): InsertData
select(insert("Superman", 1, 5, "Bat")) ...
```

#### `instr`
Search for substring in string, and return position

Default alias is `INSTR()`
```
// instr(value: any, search: any, alias?: string): InstrData
select(instr("Ironman", "man")) ...
```

#### `lcase`
Convert the text to lower-case

Default alias is `LCASE()`
```
// lcase(value: any, alias?: string): LcaseData
select(lcase("KEEP CALM AND CALL BATMAN")) ...
```

#### `left`
Extract `n` characters from a string (starting from left)

Default alias is `LEFT()`
```
// left(value: any, charsCount: number, alias?: string): LeftData
select(left("Batgirl", 3)) ...
```

#### `length`
Return the length of the string, in bytes

Default alias is `LENGTH()`
```
// length(value: any, alias?: string): LengthData
select(length("Loki")) ...
```

#### `lpad`
Left-pad the string with string, to a total length of `n`

Default alias is `LPAD()`
```
// lpad(value: any, length: number, value2: any, alias?: string): LPadData
select(lpad("Why so serious?", 40, "Ha ")) ...
```

#### `ltrim`
Remove leading spaces from a string

Default alias is `LTRIM()`
```
// ltrim(value: any, alias?: string): LTrimData
select(ltrim("    Hawkeye")) ...
```

#### `mid`
Extract a substring from a string

Default alias is `MID()`
```
// mid(value: any, start: number, length: number, alias?: string): MidData
select(mid("The amazing spiderman", 5, 7)) ...
```

#### `position`
Search for a substring in string, and return position

Default alias is `POSITION()`
```
// position(substring: any, value: any, alias?: string): PositionData
select(position("girls", "Gotham girls")) ...
```

#### `repeat`
Repeat a string `n` times

Default alias is `REPEAT()`
```
// repeat(value: any, count: number, alias?: string): RepeatData
select(repeat("POW",3)) ...
```

#### `replace`
Replace a string

Default alias is `REPLACE()`
```
// replace(value: any, from: any, to: any, alias?: string): ReplaceData
select(replace("Iron fist"," fist", "man")) ...
```

#### `reverse`
Reverse a string

Default alias is `REVERSE()`
```
// reverse(value: any, alias?: string): ReverseData
select(reverse("Thor")) ...
```

#### `right`
Extract 4 characters from a string (starting from right)

Default alias is `RIGHT()`
```
// right(value: any, charsCount: number, alias?: string): RightData
select(right("Batman is cool",4)) ...
```

#### `rpad`
Right-pad the string with "NA NA NA", to a total length of 30

Default alias is `RPAD()`
```
// rpad(value: any, length: number, value2: any, alias?: string): RPadData
select(rpad("BATMAN", 30, "NA NA NA")) ...
```

#### `rtrim`
Remove trailing spaces from a string

Default alias is `RTRIM()`
```
// rtrim(value: any, alias?: string): RTrimData
select(rtrim("Robin is       ")) ...
```

#### `space`
Return a string with `n` space characters

Default alias is `SPACE()`
```
// space(value: number, alias?: string): SpaceData
select(space(5)) ...
```

#### `strcmp`
Compare two strings

Default alias is `STRCMP()`
```
// strcmp(value: any, value2: any, alias?: string): StrcmpData
select(strcmp("wakanda", "forever")) ...
```

#### `substr`
Extract a substring from a string

Default alias is `SUBSTR()`
```
// substr(value: any, start: number, length: number, alias?: string): SubstrData
select(substr("Dr. Strange", 1, 3)) ...
```

#### `substrIndex`
Return a substring of a string before a specified number of delimiter occurs

Default alias is `SUBSTRING_INDEX()`
```
// substrIndex(value: any, delimiter: string, count: number, alias?: string): SubstrIndexData
select(substrIndex("spider-man", "-", 1)) ...
```

#### `trim`
Remove leading and trailing spaces from a string

Default alias is `TRIM()`
```
// trim(value: any, alias?: string): TrimData
select(trim("      HULK SMASH        ")) ...
```

#### `ucase`
Convert the text to upper-case

Default alias is `UCASE()`
```
// ucase(value: any, alias?: string): UcaseData
select(ucase("i am ironman")) ...
```

#### `bin`
Return a binary representation of the value.

Default alias is `BIN()`
```
// bin(value: any, alias?: string): BinData
select(bin("Ironman")) ...
```

#### `binary`
Convert a value to a binary string.

Default alias is `BINARY()`
```
// binary(value: any, alias?: string): BinaryData
select(binary("Batman")) ...
```

*Soon there will be more, the list is still growing.*

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
