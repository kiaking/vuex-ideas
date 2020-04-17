import { setupPuppeteer, E2E_TIMEOUT } from 'test/helpers'

describe('e2e/counter', () => {
  const {
    page,
    text,
    click
  } = setupPuppeteer()

  async function testCounter(type: string) {
    const baseUrl = `http://localhost:8080/${type}/counter`

    await page().goto(baseUrl)
    expect(await text('.count')).toBe('Count: 1')
    expect(await text('.double')).toBe('Double: 2')

    await click('.increment')
    expect(await text('.count')).toBe('Count: 2')
    expect(await text('.double')).toBe('Double: 4')
  }

  test('classic', async () => {
    await testCounter('classic')
  }, E2E_TIMEOUT)

  test('composition', async () => {
    await testCounter('composition')
  }, E2E_TIMEOUT)

  test('composition-ts', async () => {
    await testCounter('composition-ts')
  }, E2E_TIMEOUT)
})
