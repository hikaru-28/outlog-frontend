import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInput } from '@/api/input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Tag } from 'lucide-react'
import { toast } from 'sonner'

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
            toast('タイトルとタイプは必須です')
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
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        戻る
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">新規インプット作成</h1>
                    <p className="text-gray-600">学習した内容を記録しましょう</p>
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
                                    <option value="その他">📝 その他</option>
                                </select>
                            </div>

                            {type === "その他" && (
                                <div className="mt-3">
                                    <Input
                                        name="type"
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
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            作成
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                        >
                            キャンセル
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InputNewPage