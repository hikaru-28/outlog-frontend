import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOutputsByInputId, createOutput, updateOutput } from '@/api/output'
import { getInputById } from '@/api/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, FileText, Lightbulb } from 'lucide-react'
import type { Output } from '@/types/index'
import { toast } from 'sonner'

const OutputPage = () => {
    const [output, setOutput] = useState<Output | null>(null)
    const [outputType, setOutputType] = useState<string>('normal')
    const [content, setContent] = useState('')
    const [inputTitle, setInputTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const outputData = await getOutputsByInputId(id)
            if (outputData) {
                setOutput(outputData)
                setOutputType(outputData.outputType)
                setContent(outputData.content)
            }

            const inputData = await getInputById(id)
            if (inputData) {
                setInputTitle(inputData.title)
            }
        } catch (error) {
            console.error('データの取得に失敗しました', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!content.trim()) {
            toast.error('アウトプット内容を入力してください')
            return
        }
        try {
            if (output) {
                await updateOutput(id, content, outputType)
            } else {
                await createOutput(id, content, outputType)
            }
            toast.success('保存しました')
            navigate('/home')
        } catch (error) {
            toast.error('保存に失敗しました')
            console.error('アウトプットの保存に失敗しました', error)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    useEffect(() => {
        fetchData()
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button
                        onClick={() => navigate('/home')}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        戻る
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">アウトプット</h1>
                            <p className="text-gray-600 mt-1">{inputTitle}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-indigo-900 mb-2">アウトプットのヒント</h3>
                            <ul className="text-sm text-indigo-800 space-y-1">
                                <li>• 学んだことを自分の言葉で要約してみましょう</li>
                                <li>• 重要なポイントや気づきを箇条書きにしましょう</li>
                                <li>• 実際の業務や生活でどう活かせるか考えてみましょう</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setOutputType('normal')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium ${outputType === 'normal'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-300'
                            }`}
                    >
                        通常
                    </button>
                    <button
                        type="button"
                        onClick={() => setOutputType('speed_write')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium ${outputType === 'speed_write'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-300'
                            }`}
                    >
                        ⏱ 5分間速書き
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            アウトプット内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="学んだことをアウトプットしましょう...&#10;&#10;例:&#10;・〇〇について理解を深めた&#10;・△△の仕組みが分かった&#10;・実際の業務で××に活かせそう"
                            name="content"
                            value={content}
                            onChange={handleChange}
                            rows={12}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">学んだ内容を自分の言葉でまとめましょう</p>
                            <p className="text-xs text-gray-400">{content.length}文字</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                        <Button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-transform duration-100"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {output ? '更新する' : '保存する'}
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

export default OutputPage