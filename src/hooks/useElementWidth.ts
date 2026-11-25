import { useEffect, useRef, useState } from 'react'

/** Måler bredden til et element og oppdaterer når den endres (f.eks. ved rotasjon eller zoom). */
export function useElementWidth<T extends HTMLElement>(initial = 0) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
