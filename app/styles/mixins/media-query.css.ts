import { type BreakpointsKey, BREAKPOINTS } from '~/styles/variables/breakpoints.css'
import { REDUCED_MOTION_QUERY } from '~/styles/variables/media-features'

export const getMediaQuery = (key: BreakpointsKey | 'hover' | 'print' | 'not-scripting' | 'reduced-motion') => {
  switch (key) {
    case 'reduced-motion':
      return REDUCED_MOTION_QUERY

    case 'hover':
      return '(any-hover: hover)'

    case 'print':
      return 'print'

    case 'not-scripting':
      return '(scripting: none)'

    default:
      return `screen and (width >= ${BREAKPOINTS[key]}px), print`
  }
}

export const getMediaQueryReverse = (key: BreakpointsKey) => {
  return `screen and (width <= ${BREAKPOINTS[key] - 1}px)`
}

export const getContainerQuery = (key: BreakpointsKey) => {
  return `(width >= ${BREAKPOINTS[key]}px)`
}

export const getContainerQueryReverse = (key: BreakpointsKey) => {
  return `(width <= ${BREAKPOINTS[key] - 1}px)`
}
