import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInputById, updateInput } from '@/api/input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Tag } from 'lucide-react'
import { toast } from 'sonner'

const InputEditPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: '本',
        memo: '',
        customType: ''
    })
    const [loading, setLoading] = useState(true)
    const { title, type, memo } = formData
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()

    const fetchSingleInput = async () => {
        try {
            const { title, type, memo } = await getInputById(id)
            const predefinedTypes = ['本', 'Youtube', '記事', '講義']
            const isCustomType = !predefinedTypes.includes(type)

            setFormData({
                title,
                type: isCustomType ? 'その他' : type,
                memo: memo || '',
                customType: isCustomType ? type : ''
            })
        } catch (error) {
            console.error('インプットの取得に失敗しました', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title || !type) {
            toast.error('タイトルとタイプは必須です')
            return
        }
        try {
            await updateInput(id, title, type === 'その他' ? formData.customType : type, memo)
            toast.success('更新しました')
            navigate('/home')
        } catch (error) {
            toast.error('更新に失敗しました')
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 animate-fade-in">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button
                        onClick={() => navigate('/home')}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        戻る
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">インプット編集</h1>
                    <p className="text-gray-600">インプット情報を更新します</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                タイトル <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="例: React Hooksの基礎"
                                name="title"
                                value={title}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                タイプ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="type"
                                    value={type}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="本">📚 本</option>
                                    <option value="Youtube">🎥 Youtube</option>
                                    <option value="記事">📄 記事</option>
                                    <option value="講義">🪧 講義</option>
                                    <option value="その他">📝 その他</option>
                                </select>
                            </div>

                            {type === "その他" && (
                                <div className="mt-3">
                                    <Input
                                        name="customType"
                                        value={formData.customType}
                                        onChange={handleChange}
                                        placeholder="種別を入力してください"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                メモ
                            </label>
                            <textarea
                                placeholder="学んだことや気づきを記録してください..."
                                name="memo"
                                value={memo}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">任意項目です</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-transform duration-100"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            更新
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100"
                        >
                            キャンセル
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InputEditPage