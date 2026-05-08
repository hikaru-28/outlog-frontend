import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOutputsByInputId, createOutput, updateOutput } from '@/api/output'
import { Input } from '@/components/ui/input'
// import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Output } from '@/types/index'

const OutputPage = () => {
    const [output, setOutput] = useState<Output | null>(null)
    const [content, setContent] = useState('')
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()

    const fetchOutput = async () => {
        const data = await getOutputsByInputId(id)
        if (data) {
            setOutput(data)
            setContent(data.content)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (output) {
            await updateOutput(id, content)
        } else {
            await createOutput(id, content)
        }
        navigate('/')
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value)
    }

    useEffect(() => {
        fetchOutput()
    }, [])


    return (
        <div>
            <h1>アウトプット</h1>

            <button onClick={() => navigate('/')}>キャンセル</button>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>アウトプット</label>
                    <Input
                        type="text"
                        name="content"
                        value={content}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">
                    {output ? '更新' : '保存'}
                </Button>
            </form>
        </div>
    )
}

export default OutputPage