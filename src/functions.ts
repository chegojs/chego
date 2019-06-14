
import { parseStringToTempPropertyIfRequired, ifStringThenParseToProperty } from './utils';
import { GreatestData, QuerySyntaxEnum, LeastData, CoalesceData, CountData, MaxData, MinData, SumData, AvgData, SqrtData, 
    PowData, AbsData, AcosData, AsinData, Atan2Data, AtanData, CeilData, CosData, CotData, DegreesData, DivData, ExpData, 
    FloorData, LnData, LogData, Log10Data, Log2Data, ModData, PiData, RadiansData, RandData, RoundData, SignData, SinData, 
    TanData, TruncateData, AsciiData, CharLengthData, ConcatData, ConcatWsData, Property, FieldData, FindInSetData, 
    FormatData, InsertData, InstrData, LcaseData, LeftData, LengthData, LTrimData, MidData, PositionData, RepeatData, 
    ReplaceData, ReverseData, RightData, RTrimData, SpaceData, StrcmpData, SubstrData, SubstrIndexData, TrimData, 
    UcaseData, BinData, BinaryData, LPadData, RPadData } from '@chego/chego-api';

export const greatest = (values: any[], alias?: string): GreatestData => ({
    type: QuerySyntaxEnum.Greatest,
    param: values.reduce((result: Property[], curent: any) => (result.push(parseStringToTempPropertyIfRequired(curent)), result), []),
    alias: (alias ? alias : `GREATEST(${values.join(',')})`)
});
export const least = (values: any[], alias?: string): LeastData => ({
    type: QuerySyntaxEnum.Least,
    param: values.reduce(ifStringThenParseToProperty, []),
    alias: (alias ? alias : `LEAST(${values.join(',')})`)
});
export const coalesce = (values: any[], alias?: string): CoalesceData => ({
    type: QuerySyntaxEnum.Coalesce,
    param: values.reduce(ifStringThenParseToProperty, []),
    alias: (alias ? alias : `COALESCE(${values.join(',')})`)
});
export const count = (value: any, alias?: string): CountData => ({
    type: QuerySyntaxEnum.Count,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `COUNT(${value})`)
});
export const max = (value: any, alias?: string): MaxData => ({
    type: QuerySyntaxEnum.Max,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `MAX(${value})`)
});
export const min = (value: any, alias?: string): MinData => ({
    type: QuerySyntaxEnum.Min,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `MIN(${value})`)
});

export const sum = (value: any, alias?: string): SumData => ({
    type: QuerySyntaxEnum.Sum,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `SUM(${value})`)
});
export const avg = (value: any, alias?: string): AvgData => ({
    type: QuerySyntaxEnum.Avg,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `AVG(${value})`)
});
export const sqrt = (value: any, alias?: string): SqrtData => ({
    type: QuerySyntaxEnum.Sqrt,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `SQRT(${value})`)
});
export const pow = (value: any, exponent: number, alias?: string): PowData => ({
    type: QuerySyntaxEnum.Pow,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        exponent
    },
    alias: (alias ? alias : `POW(${value})`)
});

export const abs = (value: any, alias?: string): AbsData => ({
    type: QuerySyntaxEnum.Abs,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `ABS(${value})`)
});

export const acos = (value: any, alias?: string): AcosData => ({
    type: QuerySyntaxEnum.Acos,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `ACOS(${value})`)
});

export const asin = (value: any, alias?: string): AsinData => ({
    type: QuerySyntaxEnum.Asin,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `ASIN(${value})`)
});

export const atan = (value: any, alias?: string): AtanData => ({
    type: QuerySyntaxEnum.Atan,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `ATAN(${value})`)
});

export const atan2 = (y: any, x: any, alias?: string): Atan2Data => ({
    type: QuerySyntaxEnum.Atan2,
    param: {
        x: parseStringToTempPropertyIfRequired(x),
        y: parseStringToTempPropertyIfRequired(y)
    },
    alias: (alias ? alias : `ATAN2(${y},${x})`)
});

export const ceil = (value: any, alias?: string): CeilData => ({
    type: QuerySyntaxEnum.Ceil,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `CEIL(${value})`)
});

export const cos = (value: any, alias?: string): CosData => ({
    type: QuerySyntaxEnum.Cos,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `COS(${value})`)
});

export const cot = (value: any, alias?: string): CotData => ({
    type: QuerySyntaxEnum.Cot,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `COT(${value})`)
});

export const degrees = (value: any, alias?: string): DegreesData => ({
    type: QuerySyntaxEnum.Degrees,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `DEGREES(${value})`)
});

export const div = (x: any, y: any, alias?: string): DivData => ({
    type: QuerySyntaxEnum.Div,
    param: {
        x: parseStringToTempPropertyIfRequired(x),
        y: parseStringToTempPropertyIfRequired(y)
    },
    alias: (alias ? alias : `${x} DIV ${y}`)
});

export const exp = (value: any, alias?: string): ExpData => ({
    type: QuerySyntaxEnum.Exp,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `EXP(${value})`)
});

export const floor = (value: any, alias?: string): FloorData => ({
    type: QuerySyntaxEnum.Floor,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `FLOOR(${value})`)
});

export const ln = (value: any, alias?: string): LnData => ({
    type: QuerySyntaxEnum.Ln,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LN(${value})`)
});

export const log = (value: any, alias?: string): LogData => ({
    type: QuerySyntaxEnum.Log,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LOG(${value})`)
});

export const log10 = (value: any, alias?: string): Log10Data => ({
    type: QuerySyntaxEnum.Log10,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LOG10(${value})`)
});

export const log2 = (value: any, alias?: string): Log2Data => ({
    type: QuerySyntaxEnum.Log2,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LOG2(${value})`)
});

export const mod = (x: any, y: any, alias?: string): ModData => ({
    type: QuerySyntaxEnum.Mod,
    param: {
        x: parseStringToTempPropertyIfRequired(x),
        y: parseStringToTempPropertyIfRequired(y)
    },
    alias: (alias ? alias : `MOD(${x},${y})`)
});

export const pi = (alias?: string): PiData => ({
    type: QuerySyntaxEnum.Pi,
    param: null,
    alias: (alias ? alias : `PI()`)
});

export const radians = (value: any, alias?: string): RadiansData => ({
    type: QuerySyntaxEnum.Radians,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `RADIANS(${value})`)
});

export const rand = (value: any, alias?: string): RandData => ({
    type: QuerySyntaxEnum.Rand,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `RAND(${value})`)
});

export const round = (value: any, decimal: number, alias?: string): RoundData => ({
    type: QuerySyntaxEnum.Round,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        decimal
    },
    alias: (alias ? alias : `ROUND(${value},${decimal})`)
});

export const sign = (value: any, alias?: string): SignData => ({
    type: QuerySyntaxEnum.Sign,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `SIGN(${value})`)
});

export const sin = (value: any, alias?: string): SinData => ({
    type: QuerySyntaxEnum.Sin,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `SIN(${value})`)
});

export const tan = (value: any, alias?: string): TanData => ({
    type: QuerySyntaxEnum.Tan,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `TAN(${value})`)
});

export const truncate = (value: any, alias?: string): TruncateData => ({
    type: QuerySyntaxEnum.Truncate,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `TRUNCATE(${value})`)
});

export const ascii = (value: any, alias?: string): AsciiData => ({
    type: QuerySyntaxEnum.Ascii,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `ASCII(${value})`)
});

export const charLength = (value: any, alias?: string): CharLengthData => ({
    type: QuerySyntaxEnum.CharLength,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `CHAR_LENGTH(${value})`)
});

export const concat = (values: any[], alias?: string): ConcatData => ({
    type: QuerySyntaxEnum.Concat,
    param: values.reduce(ifStringThenParseToProperty, []),
    alias: (alias ? alias : `CONCAT(${values.join(',')})`)
});

export const concatWs = (separator: string, values: any[], alias?: string): ConcatWsData => ({
    type: QuerySyntaxEnum.ConcatWs,
    param: {
        separator,
        values: values.reduce(ifStringThenParseToProperty, [])
    },
    alias: (alias ? alias : `CONCAT_WS(${values.join(',')})`)
});

export const field = (search: any, values: any[], alias?: string): FieldData => ({
    type: QuerySyntaxEnum.Field,
    param: {
        search: parseStringToTempPropertyIfRequired(search),
        values: values.reduce(ifStringThenParseToProperty, [])
    },
    alias: (alias ? alias : `FIELD(${search},${values.join(',')})`)
});

export const findInSet = (search: any, set: string, alias?: string): FindInSetData => ({
    type: QuerySyntaxEnum.FindInSet,
    param: {
        search: parseStringToTempPropertyIfRequired(search),
        set
    },
    alias: (alias ? alias : `FIND_IN_SET(${search}, ${set})`)
});

export const format = (value: any, decimal: number, alias?: string): FormatData => ({
    type: QuerySyntaxEnum.Format,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        decimal
    },
    alias: (alias ? alias : `FORMAT(${value}, ${decimal})`)
});

export const insert = (value: string, position: number, length: number, toInsert: any, alias?: string): InsertData => ({
    type: QuerySyntaxEnum.InsertString,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        position,
        length,
        toInsert: parseStringToTempPropertyIfRequired(toInsert)
    },
    alias: (alias ? alias : `INSERT(${value})`)
});

export const instr = (value: any, search: any, alias?: string): InstrData => ({
    type: QuerySyntaxEnum.Instr,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        search: parseStringToTempPropertyIfRequired(search)
    },
    alias: (alias ? alias : `INSTR(${value}, ${search})`)
});

export const lcase = (value: any, alias?: string): LcaseData => ({
    type: QuerySyntaxEnum.Lcase,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LCASE(${value})`)
});

export const left = (value: any, charsCount: number, alias?: string): LeftData => ({
    type: QuerySyntaxEnum.Left,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        charsCount
    },
    alias: (alias ? alias : `LEFT(${value},${charsCount})`)
});

export const length = (value: any, alias?: string): LengthData => ({
    type: QuerySyntaxEnum.Length,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LENGTH(${value})`)
});

export const lpad = (value: any, length: number, value2: any, alias?: string): LPadData => ({
    type: QuerySyntaxEnum.Lpad,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        length,
        value2: parseStringToTempPropertyIfRequired(value2)
    },
    alias: (alias ? alias : `LPAD(${value},${length},${value2})`)
});

export const ltrim = (value: any, alias?: string): LTrimData => ({
    type: QuerySyntaxEnum.Ltrim,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `LTRIM(${value})`)
});

export const mid = (value: any, start: number, length: number, alias?: string): MidData => ({
    type: QuerySyntaxEnum.Mid,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        start,
        length
    },
    alias: (alias ? alias : `MID(${value},${start},${length})`)
});

export const position = (substring: any, value: any, alias?: string): PositionData => ({
    type: QuerySyntaxEnum.Position,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        substring: parseStringToTempPropertyIfRequired(substring)
    },
    alias: (alias ? alias : `POSITION(${substring} IN ${value})`)
});
export const repeat = (value: any, count: number, alias?: string): RepeatData => ({
    type: QuerySyntaxEnum.Repeat,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        count
    },
    alias: (alias ? alias : `REPEAT(${value},${count})`)
});

export const replace = (value: any, from: any, to: any, alias?: string): ReplaceData => ({
    type: QuerySyntaxEnum.ReplaceString,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        from: parseStringToTempPropertyIfRequired(from),
        to: parseStringToTempPropertyIfRequired(to)
    },
    alias: (alias ? alias : `REPALCE(${value},${from},${to})`)
});

export const reverse = (value: any, alias?: string): ReverseData => ({
    type: QuerySyntaxEnum.Reverse,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `REVERSE(${value})`)
});

export const right = (value: any, charsCount: number, alias?: string): RightData => ({
    type: QuerySyntaxEnum.Right,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        charsCount
    },
    alias: (alias ? alias : `RIGHT(${value},${charsCount})`)
});

export const rpad = (value: any, length: number, value2: any, alias?: string): RPadData => ({
    type: QuerySyntaxEnum.Rpad,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        length,
        value2: parseStringToTempPropertyIfRequired(value2)
    },
    alias: (alias ? alias : `RPAD(${value},${length},${value2})`)
});

export const rtrim = (value: any, alias?: string): RTrimData => ({
    type: QuerySyntaxEnum.Rtrim,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `RTRIM(${value})`)
});

export const space = (value: number, alias?: string): SpaceData => ({
    type: QuerySyntaxEnum.Space,
    param: value,
    alias: (alias ? alias : `SPACE(${value})`)
});

export const strcmp = (value: any, value2: any, alias?: string): StrcmpData => ({
    type: QuerySyntaxEnum.Strcmp,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        value2: parseStringToTempPropertyIfRequired(value2)
    },
    alias: (alias ? alias : `STRCMP(${value}, ${value2})`)
});

export const substr = (value: any, start: number, length: number, alias?: string): SubstrData => ({
    type: QuerySyntaxEnum.Substr,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        start,
        length
    },
    alias: (alias ? alias : `SUBSTR(${value},${start},${length})`)
});

export const substrIndex = (value: any, delimiter: string, count: number, alias?: string): SubstrIndexData => ({
    type: QuerySyntaxEnum.SubstringIndex,
    param: {
        value: parseStringToTempPropertyIfRequired(value),
        delimiter,
        count
    },
    alias: (alias ? alias : `SUBSTRING_INDEX(${value})`)
});

export const trim = (value: any, alias?: string): TrimData => ({
    type: QuerySyntaxEnum.Trim,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `TRIM(${value})`)
});

export const ucase = (value: any, alias?: string): UcaseData => ({
    type: QuerySyntaxEnum.Ucase,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `UCASE(${value})`)
});


export const bin = (value: any, alias?: string): BinData => ({
    type: QuerySyntaxEnum.Bin,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `BIN(${value})`)
});


export const binary = (value: any, alias?: string): BinaryData => ({
    type: QuerySyntaxEnum.Binary,
    param: parseStringToTempPropertyIfRequired(value),
    alias: (alias ? alias : `Binary(${value})`)
});
