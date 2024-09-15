/** Position fixed breaks in mobile Safari when the keyboard is up. This module provides functionality to emulate position:fixed by changing all top navigation to position:absolute and updating on scroll. */
import { isIOS, isSafari, isTouch } from '../browser'
import { noop } from '../constants'
import * as selection from '../device/selection'

/** Default mode is fixed. Absolute mode emulates positioned fixed by switching to position absolute and updating the y position on scroll. */
let mode: 'absolute' | 'fixed' = 'fixed'

/** Initializes handler to switch position fixed elements to position absolute when the keyboard is up on mobile Safari. Returns an unsubscribe function. */
const init = () => {
  if (isTouch && isSafari() && !isIOS) {
    document.addEventListener('selectionchange', onChange)
    return () => {
      document.removeEventListener('selectionchange', onChange)
    }
  } else {
    return noop
  }
}

/** Start or stop position absolute mode. Throttled to 60 fps. */
const onChange = () => {
  if (selection.isActive()) {
    start()
  } else {
    stop()
  }
}

/** Updates the position of elements with position fixed while scrolling in order to show them always on top. */
const onScroll = () => {
  const alert = document.getElementsByClassName('alert')[0] as HTMLElement
  const hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0] as HTMLElement
  const toolbar = document.getElementsByClassName('toolbar-container')[0] as HTMLElement
  Array.from([alert, hamburgerMenu, toolbar]).forEach(el => {
    if (!el) return // hamburger menu and toolbar are not rendered during tutorial
    el.style.top = `${window.scrollY}px`
  })
}

/** Change position:fixed top nav to position:absolute in order to fix Safari position:fixed browser behavior when keyboard is up. */
const start = () => {
  if (mode === 'absolute') return
  ;('absolute')
  mode = 'absolute'
  document.addEventListener('scroll', onScroll)
  const alert = document.getElementsByClassName('alert')[0] as HTMLElement
  const hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0] as HTMLElement
  const toolbar = document.getElementsByClassName('toolbar-container')[0] as HTMLElement
  const rightArrow = document.getElementById('right-arrow') as HTMLElement
  const leftArrow = document.getElementById('left-arrow') as HTMLElement
  Array.from([alert, hamburgerMenu, toolbar, rightArrow, leftArrow]).forEach(el => {
    if (!el) return // hamburger menu and toolbar are not rendered during tutorial
    el.style.position = 'absolute'
    el.style.overflowX = 'hidden'
    if (el !== rightArrow && el !== leftArrow) {
      el.style.top = `${window.scrollY}px`
    }
  })
}

/** Reset position:absolute of toolbar elements. */
const stop = () => {
  if (mode === 'fixed') return
  mode = 'fixed'
  document.removeEventListener('scroll', onScroll)
  const alert = document.getElementsByClassName('alert')[0] as HTMLElement
  const hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0] as HTMLElement
  const toolbar = document.getElementsByClassName('toolbar-container')[0] as HTMLElement
  const rightArrow = document.getElementById('right-arrow') as HTMLElement
  const leftArrow = document.getElementById('left-arrow') as HTMLElement
  Array.from([alert, hamburgerMenu, toolbar, rightArrow, leftArrow]).forEach(el => {
    if (!el) return // hamburger menu and toolbar are not rendered during tutorial
    el.style.position = 'fixed'
    el.style.overflowX = ''
    el.style.top = ''
  })
}

export default init
