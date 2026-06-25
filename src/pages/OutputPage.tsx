import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOutputsByInputId, createOutput, updateOutput } from '@/api/output'
import { getInputById } from '@/api/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, FileText, Lightbulb } from 'lucide-react'
import type { Output } from '@/types/index'
import { toast } from 'sonner'
import mermaid from 'mermaid'

const OutputPage = () => {
    const [output, setOutput] = useState<Output | null>(null)
    const [outputType, setOutputType] = useState<string>('normal')
    const [content, setContent] = useState('')
    const [inputTitle, setInputTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const { id } = useParams() as { id: string }
    const navigate = useNavigate()

    const [timeLeft, setTimeLeft] = useState<number>(5 * 60) // 5分間のタイマー（秒単位）
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false)

    // Mermaidのプレビュー表示用のref

    const mermaidRef = useRef<HTMLDivElement>(null)
    const [showHint, setShowHint] = useState<boolean>(false)

    // ファイマンテクニック
    const [feynmanSimple, setFeynmanSimple] = useState<string>('')
    const [feynmanAnalogy, setFeynmanAnalogy] = useState<string>('')


    const outputTypeInfo: Record<string, { label: string; description: string }> = {
        normal: {
            label: '通常',
            description: 'インプットの内容を自由に振り返り、自分の言葉でまとめます。',
        },
        speed_write: {
            label: '5分間速書き',
            description: 'タイマーが鳴るまで止まらずに書き続けます。何が記憶に残っているかを素早く確認するのに最適です。'
        },
        mermaid: {
            label: '📊 図解',
            description: 'Mermaid記法で要素間の関係性を図として可視化します。構造を整理する力が身につきます。'
        },
        feynman: {
            label: '🧠 ファインマン・テクニック',
            description: '専門用語を使わず、子供に説明するように書くことで理解の抜けを発見できます。例え話を使うとさらに理解が深まります。',
        }
    }

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

    useEffect(() => {
        if (!isTimerRunning || timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimerRunning(false)
                    setIsTimeUp(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isTimerRunning, timeLeft])

    const insertMermaidTemplate = () => {
        setContent(`graph TD\n  A[開始] --> B[処理]\n  B --> C[終了]`)
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            suppressErrorRendering: true
        })
    }, [])

    useLayoutEffect(() => {
        if (outputType !== 'mermaid' || !content || !mermaidRef.current) return

        mermaid.render('mermaid-preview', content)
            .then((result) => {
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = result.svg
                }
            })
            .catch((error) => {
                console.error('Mermaid記法エラー:', error)
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = `<p class="text-red-500 text-sm">記法にエラーがあります</p>`
                }
            })
    }, [content, outputType, loading])


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
                    <button
                        type="button"
                        onClick={() => setOutputType('mermaid')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium ${outputType === 'mermaid'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-300'
                            }`}
                    >
                        📊 図解
                    </button>
                    <button
                        type="button"
                        onClick={() => setOutputType('feynman')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium ${outputType === 'feynman'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-300'
                            }`}
                    >
                        🧠 ファインマン
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4 px-1">
                    {outputTypeInfo[outputType].description}
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6">
                        {outputType === 'speed_write' && (
                            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                                <div className="text-2xl font-bold text-orange-600">
                                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                </div>
                                {!isTimerRunning && !isTimeUp && (
                                    <Button
                                        type="button"
                                        onClick={() => setIsTimerRunning(true)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        スタート
                                    </Button>
                                )}
                                {isTimeUp && (
                                    <span className="text-orange-600 font-medium">時間切れです！</span>
                                )}
                            </div>
                        )}
                        {outputType === 'mermaid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Mermaidコード <span className="text-red-500">*</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowHint(!showHint)}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 mb-2 flex items-center gap-1"
                                    >
                                        {showHint ? '▲' : '▼'} 記法のヒントを表示
                                    </button>

                                    {showHint && (
                                        <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-gray-700 space-y-2">
                                            <div>
                                                <p className="font-medium text-indigo-900">矢印でつなぐ：</p>
                                                <code className="block bg-white px-2 py-1 rounded mt-1">A --&gt; B</code>
                                            </div>
                                            <div>
                                                <p className="font-medium text-indigo-900">ボックスに文字を入れる：</p>
                                                <code className="block bg-white px-2 py-1 rounded mt-1">A[開始] --&gt; B[終了]</code>
                                            </div>
                                            <div>
                                                <p className="font-medium text-indigo-900">条件分岐：</p>
                                                <code className="block bg-white px-2 py-1 rounded mt-1">A --&gt; B{`{条件}`}<br />B --&gt;|Yes| C</code>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={insertMermaidTemplate}
                                        className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-300 hover:border-indigo-400 px-3 py-1 rounded-lg mb-2"
                                    >
                                        📋 テンプレートを挿入
                                    </button>

                                    <textarea
                                        placeholder={`例:\ngraph TD\n  A[開始] --> B[処理]\n  B --> C[終了]`}
                                        value={content}
                                        onChange={handleChange}
                                        rows={12}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        プレビュー
                                    </label>
                                    <div
                                        ref={mermaidRef}
                                        className="w-full h-[296px] border border-gray-300 rounded-lg p-4 overflow-auto bg-gray-50 flex items-center justify-center"
                                    />
                                </div>
                            </div>
                        ) : outputType === 'feynman' ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        専門用語を使わずに説明する <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">小学生に説明するつもりで、難しい言葉を使わずに書いてみましょう</p>
                                    <textarea
                                        placeholder="例：useEffectは、画面が表示された後に「何かをする」ための仕組みです..."
                                        value={feynmanSimple}
                                        onChange={(e) => setFeynmanSimple(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        例え話で説明する
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">日常生活の何かに例えて説明してみましょう（任意）</p>
                                    <textarea
                                        placeholder="例：useEffectは、料理が完成した後に「いただきます」と言う瞬間のようなものです..."
                                        value={feynmanAnalogy}
                                        onChange={(e) => setFeynmanAnalogy(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    アウトプット内容 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="学んだことをアウトプットしましょう...&#10;&#10;例:&#10;・〇〇について理解を深めた&#10;・△△の仕組みが分かった&#10;・実際の業務で××に活かせそう"
                                    name="content"
                                    value={content}
                                    onChange={handleChange}
                                    rows={12}
                                    disabled={outputType === 'speed_write' && isTimeUp}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">学んだ内容を自分の言葉でまとめましょう</p>
                                    <p className="text-xs text-gray-400">{content.length}文字</p>
                                </div>
                            </>
                        )}
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