import { Meta } from '@storybook/react'
import cn from "classnames"
import { useState } from 'react'

import PullToRefresh from './PullToRefresh'
import classes from './PullToRefresh.stories.module.scss'

export default {
    component: PullToRefresh,
    title: 'PullToRefresh',
} as Meta

export const Simple = (): JSX.Element => {
    const [items, set] = useState(Array.from({ length: 50 }, (v, k) => k + 1))

    const onRefresh = () => {
        set([...items, items.length + 1])
        console.log("Refresh")
    }

    return (
        <div className={classes.col}>
            <PullToRefresh onRefresh={onRefresh}>
                {items.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </PullToRefresh>
        </div>
    )
}

export const Nested = (): JSX.Element => {
    const [items, set] = useState(Array.from({ length: 50 }, (v, k) => k + 1))

    const onRefresh = () => {
        set([...items, items.length + 1])
    }

    return (
        <div className={cn(classes.col, classes.nested)}>
            <PullToRefresh onRefresh={onRefresh}>
                {items.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </PullToRefresh>
        </div>
    )
}
