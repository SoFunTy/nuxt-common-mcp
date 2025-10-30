import lodash from 'lodash'

declare module 'lodash' {
    interface LoDashStatic {
        stringify: (val: any) => string
        snakeCaseObj: <T>(input: T) => T
        jsonizeValues: <T>(input: T) => T
    }
}

lodash.mixin({
    stringify: (val: any): string => {
        if (val == null) return ''
        if (typeof val === 'object') return JSON.stringify(val)
        return String(val)
    },
    snakeCaseObj: <T>(input: T): T => {
        const snakeCase = (str: string) => _.snakeCase(str)

        const transform = (obj: any): any => {
            if (_.isArray(obj)) {
                return _.map(obj, item => (_.isObject(item) && !_.isArray(item) ? transform(item) : item))
            } else if (_.isObject(obj)) {
                return _.mapKeys(obj, (value, key) => snakeCase(key))
            }
            return obj
        }

        if (_.isArray(input)) {
            return _.map(input, item => (_.isObject(item) ? transform(item) : item)) as T
        } else if (_.isObject(input)) {
            return transform(input) as T
        }

        return input
    },
    jsonizeValues: <T>(input: T): T => {
        const processValue = (value: any): any => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
            return value;
        };

        const traverse = (obj: any): any => {
            if (_.isArray(obj)) {
                return _.map(obj, traverse);
            }
            if (_.isObject(obj)) {
                return _.mapValues(obj, traverse);
            }
            return processValue(obj);
        };

        if (_.isArray(input) || _.isObject(input)) {
            return traverse(input) as T;
        }
        return processValue(input) as T;
    }
})

export const _ = lodash
