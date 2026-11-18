import { useCallback, useEffect, useRef } from 'react'

/** setTimeout helper that auto-clears on unmount */
export function useTimers() {
  const ids = useRef([])
  useEffect(
    () => () => {
      ids.current.forEach(clearTimeout)
      ids.current = []
    },
    [],
  )
  return useCallback((ms, fn) => {
    const id = setTimeout(fn, ms)
    ids.current.push(id)
    return id
  }, [])
}
