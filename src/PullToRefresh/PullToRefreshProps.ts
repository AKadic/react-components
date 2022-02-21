import type { ReactNode } from 'react'

export interface PullToRefreshProps {
    children?: Iterable<ReactNode>
    limit?: number
    onRefresh: () => void
}
