import { useState, useEffect } from 'react'
import { getAllInputs, deleteInput } from '@/api/input'
import { toast } from 'sonner'
import type { Input } from '../types'

const useInputs = () => {
    const [inputs, setInputs] = useState<Input[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    const fetchInputs = async () => {
        setLoading(true)
        try {
            const data = await getAllInputs(currentPage)
            setInputs(data.inputs)
            setTotalPage(Math.ceil(data.total / 10))
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'inputの取得に失敗しました')
            console.error('inputの取得に失敗しました', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteInput(id)
            toast.success('削除に成功しました')
            fetchInputs()
        } catch (error) {
            toast.error('削除に失敗しました')
        }
    }

    useEffect(() => {
        fetchInputs()
    }, [currentPage])

    return { inputs, currentPage, totalPage, loading, setCurrentPage, handleDelete }
}

export default useInputs

