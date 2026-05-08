import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllInputs, deleteInput } from '@/api/input'
import { Button } from '@/components/ui/button'
import type { Input } from '../types'

const HomePage = () => {
    const [inputs, setInputs] = useState<Input[]>([])
    const navigate = useNavigate()

    const fetchInputs = async () => {
        try {
            const data = await getAllInputs()
            setInputs(data)
        } catch (error) {
            console.error('inputの取得に失敗しました', error)
        }
    }

    const handleDelete = async (id: string) => {
        await deleteInput(id)
        fetchInputs()
    }

    const isOverdue = (createdAt: string) => {
        const now = new Date()
        const created = new Date(createdAt)
        const diff = now.getTime() - created.getTime()
        return diff > 24 * 60 * 60 * 1000  // 24時間をミリ秒で表現
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        fetchInputs()
    }, [])

    return (
        <div>
            <Button onClick={handleLogout}>ログアウト</Button>

            <h1>インプット一覧</h1>

            <Link to='/inputs/new'>新規インプット</Link>

            <ul>
                {inputs.map((input) => {
                    return (
                        <li key={input.id}>
                            <h3>{input.title}</h3>
                            <p>{input.type}</p>
                            <p>{input.memo}</p>
                            <p>{input.isOutputDone ? '完了' : '未完了'}</p>
                            <p>{input.createdAt}</p>
                            <Link to={`/inputs/${input.id}/edit`}>編集</Link>
                            <Button onClick={() => handleDelete(input.id)}>削除</Button>
                            <Link to={`/inputs/${input.id}/output`}>アウトプット</Link>
                            {isOverdue(input.createdAt) && !input.isOutputDone && <p>インプットから24時間経過しています</p>}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default HomePage