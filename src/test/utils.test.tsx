import { describe, test, expect } from 'vitest'
import { BookOpen, PlayCircle, FileText, GraduationCap } from 'lucide-react'

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

const getTypeIcon = (type: string, size: string = 'w-5 h-5') => {
    switch (type) {
        case '本':
            return <BookOpen className={size} />
        case 'Youtube':
            return <PlayCircle className={size} />
        case '記事':
            return <FileText className={size} />
        case '講義':
            return <GraduationCap className={size} />
        default:
            return <FileText className={size} />
    }
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

describe('getTypeIcon', () => {
    test('本のときBookOpenアイコンを返すこと', () => {
        const icon = getTypeIcon('本')
        expect(icon).toEqual(<BookOpen className="w-5 h-5" />)
    })

    test('YoutubeのときPlayCircleアイコンを返すこと', () => {
        const icon = getTypeIcon('Youtube')
        expect(icon).toEqual(<PlayCircle className="w-5 h-5" />)
    })

    test('記事のときFileTextアイコンを返すこと', () => {
        const icon = getTypeIcon('記事')
        expect(icon).toEqual(<FileText className="w-5 h-5" />)
    })

    test('講義のときGraduationCapアイコンを返すこと', () => {
        const icon = getTypeIcon('講義')
        expect(icon).toEqual(<GraduationCap className="w-5 h-5" />)
    })

    test('その他のときFileTextアイコンを返すこと', () => {
        const icon = getTypeIcon('その他')
        expect(icon).toEqual(<FileText className="w-5 h-5" />)
    })

    test('sizeを指定したときそのサイズが適応されること', () => {
        const icon = getTypeIcon('本', 'w-6 h-6')
        expect(icon).toEqual(<BookOpen className="w-6 h-6" />)
    })
})