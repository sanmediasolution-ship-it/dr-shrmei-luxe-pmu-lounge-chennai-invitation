import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { audio } from '../lib/audio'
import { Corner } from '../components/Ornaments'

/** Golden bottom-sheet modal rendered inside the 9:16 stage */
export default function Sheet({ open, onClose, title, children, tall = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-[70] flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={`relative w-full rounded-t-[28px] border-t border-x border-gold/70 overflow-hidden ${tall ? 'h-[92%]' : 'max-h-[92%]'} flex flex-col`}
            style={{ background: 'linear-gradient(180deg,#1b0a12,#0b0707 40%)', boxShadow: '0 -10px 60px rgba(232,117,36,.3)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <Corner className="absolute top-2 left-2 w-9 h-9 opacity-80" />
            <Corner className="absolute top-2 right-2 w-9 h-9 opacity-80" style={{ transform: 'scaleX(-1)' }} />
            <div className="flex items-center justify-center pt-5 pb-3 px-12 relative">
              <h2 className="font-display fs-md tracking-[0.25em] gold-text text-center">{title}</h2>
              <button
                aria-label="Close"
                onClick={() => {
                  audio.sfx('tap')
                  onClose()
                }}
                className="absolute right-4 top-4 w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center text-gold bg-black/40"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto scrollbar-none px-5 pb-8 flex-1" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
