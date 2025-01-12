import { css, cx } from '../../../styled-system/css'
import { icon } from '../../../styled-system/recipes'
import { token } from '../../../styled-system/tokens'
import IconType from '../../@types/Icon'
import { ICON_SCALING_FACTOR } from '../../constants'

/** MoveCursorBackward icon. */
const MoveCursorBackwardIcon = ({ fill, size = 20, style = {}, cssRaw }: IconType) => {
  const newSize = size * ICON_SCALING_FACTOR
  const strokeColor = style.fill || fill || token('colors.fg')

  return (
    <svg
      className={cx(icon(), css(cssRaw))}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      style={{ ...style, width: `${newSize}px`, height: `${newSize}px` }}
      fill='none'
    >
      <g id='Layer_2' data-name='Layer 2'>
        <g id='Layer_3' data-name='Layer 3'>
          <g id='_16-move-thought-up' data-name='16-move-thought-up'>
            <rect width='24' height='24' fill='none' />
            <line x1='15.11' y1='4.88' x2='22.5' y2='4.88' stroke={strokeColor} strokeLinejoin='round' fill='none' />
            <line x1='15.11' y1='12' x2='22.5' y2='12' stroke={strokeColor} strokeLinejoin='round' fill='none' />
            <circle cx='10.65' cy='4.87' r='1' fill={strokeColor} />
            <circle cx='10.65' cy='12' r='1' fill={strokeColor} />
            <line x1='15.11' y1='19.13' x2='22.5' y2='19.13' stroke={strokeColor} strokeLinejoin='round' fill='none' />
            <circle cx='10.65' cy='19.13' r='1' fill={strokeColor} />
            <line x1='4.02' y1='11' x2='4.02' y2='3.3' stroke={strokeColor} strokeLinejoin='round' fill='none' />
            <polyline points='5.71 5.06 3.96 3.31 2.2 5.06' stroke={strokeColor} strokeLinejoin='round' fill='none' />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default MoveCursorBackwardIcon
