export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isObject(value: any): value is object {
  return !isArray(value) && typeof value === 'object'
}
