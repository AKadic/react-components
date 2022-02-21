import { Meta } from '@storybook/react'
import { useState } from 'react'

import PullToRefresh from './PullToRefresh'
import classes from './PullToRefresh.stories.module.scss'

export default {
    component: PullToRefresh,
    title: 'PullToRefresh',
} as Meta

export const Row = (): JSX.Element => {
    const [items, set] = useState(Array.from({ length: 50 }, (v, k) => k + 1))

    const onRefresh = () => {
        set([...items, items.length + 1])
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
