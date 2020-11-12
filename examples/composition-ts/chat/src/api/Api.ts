import channels from '/@/data/channels'

const data = {
  channels
}

export function fetch(name: string): any[] {
  return (data as any)[name]
}
