import { useDrag, useGesture, useMove, useScroll } from '@use-gesture/react'
import cn from 'classnames'
import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import type { PullToRefreshProps } from './PullToRefreshProps'
import styles from './PullToRefresh.module.scss'


function PullToRefresh({
    children,
    limit = 150,
    onRefresh,
}: PullToRefreshProps) {
    const items = Children.toArray(children)

    const [{ height }, api] = useSpring(
        () => ({ height: 0 }))

    const bind = useDrag(
        ({ down, movement: [_, my] }) => {
            api.start(() => {
                return {
                    height:
                        down && my < limit
                            ? my
                            : down && my >= limit
                                ? limit
                                : 0,
                    immediate: down
                }
            })

            if (height.get() === limit && !down) {
                onRefresh()
            }
        }, { pointer: { touch: true } })

    return (
        <div {...bind()}>
            <animated.div style={{ height }} />
            {items}
        </div>
    )
}

export default PullToRefresh
