import { useDrag, useScroll } from '@use-gesture/react'
import { Children, useCallback, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import type { PullToRefreshProps } from './PullToRefreshProps'
import styles from './PullToRefresh.module.scss'


type DragState = {  // TODO Statemachine
    enabled: boolean
    started: boolean
}

enum Direction {
    Down = -1,
    Up = 1
}

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
    limit = 50,
    onRefresh,
}: PullToRefreshProps) {
    const items = Children.toArray(children)
    const [state, setState] = useState<DragState>({ 
        enabled: false, 
        dragging: false
    })
    const [scroller, setScroller] = useState<HTMLElement>()
    const ref = useCallback(node => {
        if (node !== null) {
            setState(state => ({ ...state, enabled: node.scrollTop === 0 }))
            setScroller(getScrollParent(node))
        }
    }, []);

    const [{ height }, api] = useSpring(
        () => ({ height: 0 }))

    const bind = useDrag(
        ({ down, movement: [, my], direction: [, dy] }) => {
            if (state.dragging && !down) {
                setState(state => ({ ...state, dragging: false }))
            }

            if (down && dy === Direction.Up) {
                setState(state => ({ ...state, dragging: true }))
            }

            if (!state.dragging && down && dy === -1) return

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
        }, { axis: "y", enabled: state.enabled, pointer: { touch: state.enabled } })

    useScroll(
        ({ xy: [, y], direction: [, dy] }) => {
            if (state.enabled && dy === Direction.Down) return

            setState(state => ({ ...state, enabled: y === 0 }))
        }, { axis: "y", target: scroller })

    return (
        <div
            ref={ref}
            {...bind()}>
            <animated.div 
                className={styles.pullContainer} 
                style={{ height }}>
                Loading ...
            </animated.div>
            {items}
        </div>
    )
}

export default PullToRefresh
