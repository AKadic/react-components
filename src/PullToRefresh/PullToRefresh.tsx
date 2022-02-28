import { useDrag, useScroll } from '@use-gesture/react'
import { Children, useCallback, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import type { PullToRefreshProps } from './PullToRefreshProps'
import styles from './PullToRefresh.module.scss'

import RefreshIcon from "assets/frame1.svg"


type DragState = {  // TODO Statemachine
    enabled: boolean
    started: boolean
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
    limit = 150,
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

    const [{ top }, api] = useSpring(
        () => ({ top: -159 }))

    const bind = useDrag(
        ({ down, movement: [, my], direction: [, dy] }) => {
            if (state.dragging && !down) {
                setState(state => ({ ...state, dragging: false }))
            }

            if (down && dy === 1) {
                setState(state => ({ ...state, dragging: true }))
            }

            if (!state.dragging && down && dy === -1) return

            // Drag State
            api.start(() => {
                return {
                    top:
                        down && -159 + my < limit
                            ? -159 + my
                            : down && -159 + my >= limit
                                ? limit
                                : -159,
                    immediate: down
                }
            })

            if (top.get() === limit && !down) {
                onRefresh()
            }
        }, { axis: "y", enabled: state.enabled, pointer: { touch: state.enabled } })

    useScroll(
        ({ xy: [_, y], velocity: [, vy] }) => {
            setState(state => ({ ...state, enabled: y === 0 }))
        }, { axis: "y", target: scroller })

    return (
        <div
            className={styles.wrapper}
            ref={ref}
            {...bind()}>
            <animated.div 
                className={styles.pullContainer} 
                style={{ top }}>
                <RefreshIcon />
            </animated.div>
            {items}
        </div>
    )
}

export default PullToRefresh
