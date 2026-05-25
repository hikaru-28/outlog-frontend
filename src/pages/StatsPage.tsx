import { useEffect, useState } from 'react'
import { getAllInputs } from '@/api/input'
import type { Input } from '../types'

const StatsPage = () => {
    const [inputs, setInputs] = useState<Input[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAllInputs = async () => {
        const data = await getAllInputs(1, 1000)
        setInputs(data.inputs)
        setLoading(false)
    }

    useEffect(() => {
        fetchAllInputs()
    }, [])

    return (
        <div>
            {/* 統計ページ */}
        </div>
    )
}

export default StatsPage
