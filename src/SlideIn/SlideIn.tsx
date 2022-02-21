import { Children } from 'react'
import { animated, useTrail } from 'react-spring'

import type { SlideInProps } from './SlideInProps'

function SlideIn({ children }: SlideInProps) {
    const items = Children.toArray(children)

    const trail = useTrail(items.length, {
        from: {
            opacity: 0,
            y: -20,
        },
        to: {
            opacity: 1,
            y: 0,
        },
    })

    return (
        <>
            {trail.map((style, index) => (
                <animated.div key={index} style={style}>
                    {items[index]}
                </animated.div>
            ))}
        </>
    )
}

export default SlideIn
