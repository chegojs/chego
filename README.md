# chego

Chego is a lightweight Javascript library. 


## Install
```
npm install --save @chego/chego
```

## Usage

Usage is very simple once you decide which type of database you want to use

```
//with firebase
const { Chego, newQuery } = require("@chego/chego");
const { firebaseDriver } = require("@chego/chego-firebase");
const chego = newChego(firebaseDriver,{ firebase config });
const query = newQuery();

query.select('*').from('superheroes','villains').where('origin').is.eq('Gotham City').limit(10);

chego.execute(query)
.then(result => { console.log('RESULT:', JSON.stringify(result)) })
.catch(error => { console.log('ERROR:', error); });

```

## API

#### `newChego(driver:Fn, config:object): IChego`
Lorem ipsum

#### `newQuery(): IQuery`
Lorem ipsum

## Helpers

#### `rowId(alias: string = 'id'): Property`
Lorem ipsum

#### `alias(name: string, alias: string): Property`
Lorem ipsum

#### `or(...properties: AnyButFunction[])`
Lorem ipsum

#### `and(...properties: AnyButFunction[])`
Lorem ipsum

#### `greatest(keys: StringOrProperty[], alias?: string): FunctionData`
Lorem ipsum

#### `least(keys: StringOrProperty[], alias?: string): FunctionData`
Lorem ipsum

#### `coalesce(keys: StringOrProperty[], alias?: string): FunctionData`
Lorem ipsum

#### `count(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `max(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `min(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `sum(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `avg(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `sqrt(key: StringOrProperty, alias?: string): FunctionData`
Lorem ipsum

#### `pow(key: StringOrProperty, exponent: number, alias?: string): FunctionData`
Lorem ipsum

## Contribute


## License

Copyright (c) 2019 [Chego contributors](https://github.com/orgs/chegojs/people)

Licensed under the [MIT license](LICENSE).