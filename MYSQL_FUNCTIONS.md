# MySQL Functions

[back to readme](https://github.com/chegojs/chego/blob/master/README.md#MySQL-Functions)

## List

* [MySQL functions](#mysql-functions)
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
    * [`abs`](#abs)
    * [`acos`](#acos)
    * [`asin`](#asin)
    * [`atan`](#atan)
    * [`atan2`](#atan2)
    * [`ceil`](#ceil)
    * [`cos`](#cos)
    * [`cot`](#cot)
    * [`degrees`](#degrees)
    * [`div`](#div)
    * [`exp`](#exp)
    * [`floor`](#floor)
    * [`ln`](#ln)
    * [`log`](#log)
    * [`log10`](#log10)
    * [`log2`](#log2)
    * [`mod`](#mod)
    * [`pi`](#pi)
    * [`radians`](#radians)
    * [`rand`](#rand)
    * [`round`](#round)
    * [`sign`](#sign)
    * [`sin`](#sin)
    * [`tan`](#tan)
    * [`truncate`](#truncate)
    * [`ascii`](#ascii)
    * [`charLength`](#charLength)
    * [`concat`](#concat)
    * [`concatWs`](#concatWs)
    * [`field`](#field)
    * [`findInSet`](#findInSet)
    * [`format`](#format)
    * [`insert`](#insert)
    * [`instr`](#instr)
    * [`lcase`](#lcase)
    * [`left`](#left)
    * [`length`](#length)
    * [`lpad`](#lpad)
    * [`ltrim`](#ltrim)
    * [`mid`](#mid)
    * [`position`](#position)
    * [`repeat`](#repeat)
    * [`replace`](#replace)
    * [`reverse`](#reverse)
    * [`right`](#right)
    * [`rpad`](#rpad)
    * [`rtrim`](#rtrim)
    * [`space`](#space)
    * [`strcmp`](#strcmp)
    * [`substr`](#substr)
    * [`substrIndex`](#substrIndex)
    * [`trim`](#trim)
    * [`ucase`](#ucase)
    * [`bin`](#bin)
    * [`binary`](#binary)


## MySQL Functions

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
