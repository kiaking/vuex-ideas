import { StackFrame } from '../../'

export enum LogType {
  Activity = 'ACTIVITY',
  Mutation = 'MUTATION'
}

export interface Log {
  type: LogType
  message: string
  store: string | Symbol
  action: string
  state: string
  value: any,
  stack: StackFrame[]
}

export interface CreateLogOption {
  message?: string
  action?: string
  store?: string | Symbol
  state?: string
  value?: any
  stack?: StackFrame[]
}

export function createLog(type: LogType, log: CreateLogOption): Log {
  return {
    type,
    message: log.message ?? '',
    action: log.action ?? 'anonymous',
    store: log.store ?? '',
    state: log.state ?? '',
    value: log.value,
    stack: log.stack ?? []
  }
}
