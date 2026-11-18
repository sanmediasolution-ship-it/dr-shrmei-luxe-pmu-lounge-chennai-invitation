import { createContext, useContext } from 'react'

/** Story flow context: current stage, navigation and modal controls */
export const StoryCtx = createContext(null)
export const useStory = () => useContext(StoryCtx)

export const STAGES = ['intro', 'ch1', 'reveal', 'ribbon', 'card', 'rsvp', 'invite']

export const CHAPTERS = [
  { id: 'ch1', n: '01', title: 'THE GOLDEN KEY' },
  { id: 'reveal', n: '02', title: 'THE QUEEN REVEALED' },
  { id: 'ribbon', n: '03', title: 'THE GRAND OPENING' },
  { id: 'card', n: '04', title: 'THE INVITATION' },
]
