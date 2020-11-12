import { ref, computed, watch, nextTick } from 'vue'
import { hydrate } from 'src/marshal'

describe('unit/marshal-hydrate', () => {
  test('primitives', () => {
    const base = { str: 'a', num: 1, bool: false, n: 'not null' }
    const state = { str: 'b', num: 2, bool: true, n: null }

    hydrate(base, state)

    expect(base.str).toBe('b')
    expect(base.num).toBe(2)
    expect(base.bool).toBe(true)
    expect(base.n).toBe(null)
  })

  test('ref primitives', () => {
    const base = {
      str: ref('a'),
      num: ref(1),
      bool: ref('false'),
      n: ref('not null')
    }

    const state = {
      str: 'b',
      num: 2,
      bool: true,
      n: null
    }

    hydrate(base, state)

    expect(base.str.value).toBe('b')
    expect(base.num.value).toBe(2)
    expect(base.bool.value).toBe(true)
    expect(base.n.value).toBe(null)
  })

  test('ref object', () => {
    const base = { a: ref({ b: 1 }) }
    const state = { a: { b: 2 } }

    hydrate(base, state)

    expect(base.a.value.b).toBe(2)
  })

  test('outer reference', () => {
    const count = ref(1)
    const double = computed(() => count.value * 2)

    const base = { count, double }

    const state = { count: 2 }

    hydrate(base, state)

    expect(base.count.value).toBe(2)
    expect(base.double.value).toBe(4)
  })

  // FIXME: How can we implement this?
  test.skip('watch side effects', async () => {
    const spy = jest.fn()

    function useCount() {
      const count = ref(1)

      watch(count, spy)

      return { count }
    }

    // Trigger watch callback.
    useCount().count.value++
    await nextTick()

    // Watch callback should be emitted.
    expect(spy).toHaveBeenCalledTimes(1)

    const base = useCount()
    const state = { count: 2 }

    // Hydrate the state without triggering watch callback.
    hydrate(base, state)
    await nextTick()

    // Watch callback should not be emitted.
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
