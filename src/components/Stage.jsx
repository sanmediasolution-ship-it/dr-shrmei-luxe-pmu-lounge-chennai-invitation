import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../config/site'
import { CHAPTERS, useStory } from '../story'
import GoldDust from './GoldDust'
import { Feather } from './Ornaments'

/** 9:16 cinematic stage. On phones it is full-screen; on desktop it is framed with side ornaments. */
export default function Stage({ children }) {
  const ref = useRef(null)
  const [u, setU] = useState(4)
  useEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(() => setU(el.getBoundingClientRect().width / 100))
    ro.observe(el)
    setU(el.getBoundingClientRect().width / 100)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="stage-wrap">
      <SidePanel side="left" />
      <div ref={ref} className="stage" style={{ '--u': `${u}px` }}>
        {children}
      </div>
      <SidePanel side="right" />
    </div>
  )
}

function SidePanel({ side }) {
  const { stage } = useStory()
  return (
    <div className="hidden min-[1100px]:flex flex-1 h-full relative items-center justify-center overflow-hidden select-none">
      <GoldDust count={26} mode="float" />
      {side === 'left' ? (
        <div className="relative flex flex-col items-end pr-10 gap-3 w-full max-w-[300px]">
          <div className="font-display text-gold tracking-[0.3em] text-xs text-right">AN INTERACTIVE FILM</div>
          <div className="font-display gold-text text-3xl text-right leading-tight">{BRAND.film}</div>
          <div className="h-px w-24 bg-gold/60 my-2" />
          {CHAPTERS.map((c) => (
            <div key={c.id} className={`font-display text-[11px] tracking-[0.22em] text-right transition-all duration-700 ${stage === c.id ? 'text-ember scale-105' : 'text-champagne/35'}`}>
              {c.n} · {c.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col items-start pl-10 gap-4 w-full max-w-[300px]">
          <Feather className="w-16 opacity-70 float-y" rotate={8} />
          <div className="font-serif italic text-champagne/80 text-xl leading-snug">“A dream becomes an art. An art becomes an empire.”</div>
          <div className="font-display text-gold tracking-[0.28em] text-[11px]">{BRAND.name} · {BRAND.city}</div>
          <div className="font-sans text-champagne/40 text-[11px] tracking-widest">Best experienced on your phone with sound on.</div>
        </div>
      )}
    </div>
  )
}
