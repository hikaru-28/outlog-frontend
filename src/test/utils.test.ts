import { describe, test, expect } from 'vitest'

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
        return `${hours}時間前`
    } else {
        const days = Math.floor(hours / 24)
        return `${days}日前`
    }
}

const isOverdue = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diff = now.getTime() - created.getTime()
    return diff > 24 * 60 * 60 * 1000
}

describe('formatDate', () => {
    test('24時間以内なら⚪時間前と表示されること', () => {
        const now = new Date()
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
        expect(formatDate(threeHoursAgo)).toBe('3時間前')
    })

    test('24時間以上前なら⚪日前と表示されること', () => {
        const now = new Date()
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        expect(formatDate(twoDaysAgo)).toBe('2日前')
    })
})

describe('isOverdue', () => {
    test('24時間以内ならfalseを返すこと', () => {
        const now = new Date()
        const oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
        expect(isOverdue(oneHoursAgo)).toBe(false)
    })

    test('24時間以上ならtrueを返すこと', () => {
        const now = new Date()
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        expect(isOverdue(twoDaysAgo)).toBe(true)
    })
})