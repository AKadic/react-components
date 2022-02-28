import { useDrag, useScroll } from '@use-gesture/react'
import cn from 'classnames'
import { Children, useCallback, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import type { PullToRefreshProps } from './PullToRefreshProps'
import styles from './PullToRefresh.module.scss'

import RefreshIcon from "assets/frame1.svg"


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
    const [draggable, setDraggable] = useState<boolean>(false)
    const [scroller, setScroller] = useState<HTMLElement>()
    const ref = useCallback(node => {
        if (node !== null) {
            setScroller(getScrollParent(node))
        }
    }, []);

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
        }, { enabled: draggable, pointer: { touch: draggable } })

    useScroll(
        ({ xy: [_, y], velocity: [, vy] }) => {
            setDraggable(y === 0)
        }, { target: scroller })

    return (
        <div
            ref={ref}
            {...bind()}>
            <animated.div style={{ height }}>
                {/* <RefreshIcon /> */}
            </animated.div>
            {items}
        </div>
    )
}

export default PullToRefresh
