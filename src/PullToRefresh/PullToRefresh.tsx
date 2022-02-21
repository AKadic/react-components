import { useDrag, useScroll } from '@use-gesture/react'
import cn from 'classnames'
import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import type { PullToRefreshProps } from './PullToRefreshProps'
import styles from './PullToRefresh.module.scss'

function getScrollParent(node) {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (!node) {
        return null;
    } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
        return node;
    }

    return getScrollParent(node.parentNode) || window;
}

function PullToRefresh({
    children,
    limit = 150,
    onRefresh,
}: PullToRefreshProps) {
    const items = Children.toArray(children)

    const [draggable, setDraggable] = useState(true)
    const [scroller, setScroller] = useState<HTMLElement>()
    const ref = useCallback(node => {
        if (node !== null) {
            setScroller(getScrollParent(node))
        }
    }, []);

    const [{ height }, api] = useSpring(() => ({ height: 0 }))

    const bind = useDrag(
        ({ down, movement: [, my] }) => {
            if (down && my < 0) {
                scroller.scroll({ top: -my })
            }

            if (!down && my < 0) {
                setDraggable(false)
            }

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

            if (!down && my >= limit) {
                onRefresh()
            }
        }, { enabled: draggable })

    useScroll(
        ({ xy: [_, y], velocity: [, vy] }) => {
            if (y === 0 || (y < 25 && vy >= 1)) {
                setDraggable(true)
            }
        }, { target: scroller })

    return (
        <div
            ref={ref}
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
