export interface StackFrame {
  fileName?: string
  functionName?: string
  source?: string
  columnNumber?: number
  lineNumber?: number
}

export type Location = [string, (number | undefined)?, (number | undefined)?]

// const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m
const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/

export function get(): StackFrame[] {
  const error = generateError()

  return parse(error)
}

function createStackFrame(data: StackFrame): StackFrame {
  return data
}

function generateError(): Error {
  try {
    throw new Error()
  } catch (error) {
    return error
  }
}

function parse(error: Error) {
  if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
    return parseV8OrIE(error);
  }

  if (error.stack) {
    return parseModern(error)
  }

  throw new Error('[vuex: stack-trace] Cannot parse given Error object.')
}

function parseModern(error: Error): StackFrame[] {
  const lines = error.stack!.split('\n').filter((line) => {
    return !line.match(SAFARI_NATIVE_CODE_REGEXP)
  })

  return lines.map((line) => {
    if (line.indexOf(' > eval') > -1) {
      line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1')
    }

    if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
      // Safari eval frames only have function names and nothing else.
      return createStackFrame({
        functionName: line
      })
    }

    const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/
    const matches = line.match(functionNameRegex)
    const functionName = matches && matches[1] ? matches[1] : undefined
    const locationParts = extractLocation(line.replace(functionNameRegex, ''))

    return createStackFrame({
      functionName: functionName,
      fileName: locationParts[0],
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line
    })
  })
}

function parseV8OrIE(error: Error): StackFrame[] {
  const lines = error.stack!.split('\n').filter((line) => {
    return !!line.match(CHROME_IE_STACK_REGEXP)
  });

  return lines.map((line) => {
    if (line.indexOf('(eval ') > -1) {
      line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '')
    }

    let sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(')

    // Capture and preseve the parenthesized location "(/foo/my bar.js:12:87)"
    // in case it has spaces in it, as the string is split on \s+ later on.
    let location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/)

    // Remove the parenthesized location from the line, if it was matched.
    sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine

    const tokens = sanitizedLine.split(/\s+/).slice(1)

    // If a location was matched, pass it to extractLocation() otherwise pop
    // the last token.
    const locationParts = extractLocation(location ? location[1] as string : tokens.pop() as string)
    const functionName = tokens.join(' ') || undefined
    const fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0]

    return createStackFrame({
      functionName: functionName,
      fileName: fileName,
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line
    })
  })
}

/**
 * Separate line and column numbers from a string of the form:
 * (URI:Line:Column)
 */
function extractLocation(urlLike: string): Location {
  // Fail-fast but return locations like "(native)".
  if (urlLike.indexOf(':') === -1) {
    return [urlLike]
  }

  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/
  const parts = regExp.exec(urlLike.replace(/[()]/g, ''))!

  const uri = parts[1]
  const line = parts[2] ? Number(parts[2]) : undefined
  const column = parts[3] ? Number(parts[3]) : undefined

  return [uri, line, column]
}
