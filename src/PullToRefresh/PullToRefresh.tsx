import { useDrag, useGesture } from '@use-gesture/react'
import cn from 'classnames'
import { Children, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import styles from './PullToRefresh.module.scss'

import type { PullToRefreshProps } from './PullToRefreshProps'

function PullToRefresh({
    children,
    limit = 150,
    onRefresh,
}: PullToRefreshProps) {
    const items = Children.toArray(children)

    const [draggable, setDraggable] = useState(false)

    const [{ height }, api] = useSpring(() => ({ height: 0 }))

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
                }
            })

            if (!down && my >= limit) {
                onRefresh()
            }
        },
        { filterTaps: true, enabled: draggable }
    )

    return (
        <div
            className={cn({
                [styles.drag]: draggable,
                [styles.scroll]: !draggable,
            })}
            {...bind()}>
            <animated.div style={{ height }} />
            {items}
        </div>
    )
}

export default PullToRefresh
