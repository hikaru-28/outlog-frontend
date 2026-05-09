import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInput } from '@/api/input'
import { Input } from '@/components/ui/input'
// import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'


const InputNewPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: '本',
        memo: ''
    })

    const { title, type, memo } = formData

    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title || !type) {
            alert('タイトルとタイプは必須です')
            return
        }
        try {
            await createInput(title, type, memo)
            navigate('/')
        } catch (error) {
            console.error('インプットの作成に失敗しました', error)
        }
    }

    return (
        <div>
            <h1>新規作成</h1>

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

                <Button type="submit">作成</Button>
            </form>
        </div >
    )
}

export default InputNewPage