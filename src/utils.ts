export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isNull(value: any): value is null {
  return value === null
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && !isArray(value) && !isNull(value)
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
