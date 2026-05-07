import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInputById, updateInput } from '@/api/input'
import { Input } from '@/components/ui/input'
// import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const InputEditPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: '本',
        memo: ''
    })
    const { title, type, memo } = formData
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()

    const fetchSingleInput = async () => {
        try {
            const { title, type, memo } = await getInputById(id)
            setFormData({
                title,
                type,
                memo: memo || ''
            })
        } catch (error) {
            console.error('インプットの取得に失敗しました', error)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title || !type) {
            alert('タイトルとタイプは必須です')
            return
        }
        try {
            await updateInput(id, title, type, memo)
            navigate('/')
        } catch (error) {
            console.error('インプットの更新に失敗しました', error)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        fetchSingleInput()
    }, [])


    return (
        <div>
            <h1>インプット編集</h1>

            <Button onClick={() => navigate('/')}>キャンセル</Button>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>タイトル</label>
                    <Input
                        type="text"
                        placeholder="タイトルを入力して下さい..."
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>タイプ</label>
                    <select name="type" value={type} onChange={handleChange}>
                        <option value="本">本</option>
                        <option value="Youtube">Youtube</option>
                        <option value="記事">記事</option>
                        <option value="その他">その他</option>
                    </select>

                    {type === "その他" && (
                        <Input name="type" onChange={handleChange} placeholder="種別を入力" />
                    )}
                </div>

                <div>
                    <label>メモ</label>
                    <Input
                        type="text"
                        placeholder="メモを入力してください..."
                        name="memo"
                        value={memo}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">更新</Button>
            </form>
        </div >
    )
}

export default InputEditPage