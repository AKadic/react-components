import { Meta } from '@storybook/react'

import SlideIn from './SlideIn'
import classes from './SlideIn.stories.module.scss'

export default {
    component: SlideIn,
    title: 'SlideIn',
} as Meta

const listItems = [1, 2, 3, 4]

export const Row = (): JSX.Element => {
    return (
        <div className={classes.row}>
            <SlideIn>
                {listItems.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </SlideIn>
        </div>
    )
}
