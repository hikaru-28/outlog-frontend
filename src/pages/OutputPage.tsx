import type { FormEvent, ChangeEvent } from 'react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOutputsByInputId, createOutput, updateOutput } from '@/api/output'
import { getInputById } from '@/api/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, FileText } from 'lucide-react'
import type { Output } from '@/types/index'
import { toast } from 'sonner'
import mermaid from 'mermaid'
import NormalOutput from '@/components/output/NormalOutput'
import SpeedWriteOutput from '@/components/output/SpeedWriteOutput'
import MermaidOutput from '@/components/output/MermaidOutput'
import FeynmanOutput from '@/components/output/FeynmanOutput'

const OutputPage = () => {
    const [output, setOutput] = useState<Output | null>(null)
    const [outputType, setOutputType] = useState<string>('normal')

    const [normalContent, setNormalContent] = useState<string>('')
    const [speedWriteContent, setSpeedWriteContent] = useState<string>('')
    const [mermaidContent, setMermaidContent] = useState<string>('')

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
    const [mermaidEditorHeight, setMermaidEditorHeight] = useState<number>(450) // 初期値を設定
    const mermaidTextareaRef = useRef<HTMLTextAreaElement>(null)

    const handleMermaidResize = () => {
        if (mermaidTextareaRef.current) {
            setMermaidEditorHeight(mermaidTextareaRef.current.offsetHeight)
        }
    }

    // ファイマンテクニック
    const [feynmanSimple, setFeynmanSimple] = useState<string>('')
    const [feynmanAnalogy, setFeynmanAnalogy] = useState<string>('')

    const [showGuide, setShowGuide] = useState<boolean>(false)


    const outputTypeInfo: Record<string, { label: string; description: string; suitable: string[]; steps: string[] }> = {
        normal: {
            label: '通常',
            description: 'インプットの内容を自由に振り返り、自分の言葉でまとめます。',
            suitable: ['全般的な学習内容', '書籍・記事・講義の振り返り'],
            steps: ['インプットの内容を思い出しながら書く', '重要なポイントを自分の言葉でまとめる', '実際の業務や生活でどう活かせるか考える']
        },
        speed_write: {
            label: '5分間速書き',
            description: 'タイマーが鳴るまで止まらずに書き続けます。何が記憶に残っているかを素早く確認するのに最適です。',
            suitable: ['暗記系・手続き系の学習', 'コマンドや関数名など'],
            steps: ['スタートを押してタイマーを開始', '整理せずに思い出せることを全て書き出す', '時間切れになったら保存する']
        },
        mermaid: {
            label: '📊 図解',
            description: 'Mermaid記法で要素間の関係性を図として可視化します。構造を整理する力が身につきます。',
            suitable: ['システム構成・フロー・論理構造', '物事の全体像や関係性の理解'],
            steps: ['左側にMermaid記法でコードを書く', 'リアルタイムで右側にプレビューが表示される', '図として保存する']
        },
        feynman: {
            label: '🧠 ファインマン・テクニック',
            description: '専門用語を使わず、子供に説明するように書くことで理解の抜けを発見できます。',
            suitable: ['複雑な概念・理論の学習', '専門用語が多い学習内容'],
            steps: ['専門用語を使わずに説明する', '日常生活の例え話で説明する', '説明できない部分が理解の抜けを示す']
        }
    }

    const getCurrentContent = () => {
        switch (outputType) {
            case 'normal': return normalContent
            case 'speed_write': return speedWriteContent
            case 'mermaid': return mermaidContent
            default: return normalContent
        }
    }

    const setCurrentContent = (value: string) => {
        switch (outputType) {
            case 'normal': setNormalContent(value); break
            case 'speed_write': setSpeedWriteContent(value); break
            case 'mermaid': setMermaidContent(value); break
            default: setNormalContent(value); break
        }
    }

    const fetchData = async () => {
        try {
            const outputData = await getOutputsByInputId(id)
            if (outputData) {
                setOutput(outputData)
                setOutputType(outputData.outputType)

                if (outputData.outputType === 'feynman') {
                    const parsedContent = JSON.parse(outputData.content)
                    setFeynmanSimple(parsedContent.simple || '')
                    setFeynmanAnalogy(parsedContent.analogy || '')
                } else {
                    switch (outputData.outputType) {
                        case 'speed_write': setSpeedWriteContent(outputData.content); break
                        case 'mermaid': setMermaidContent(outputData.content); break
                        default: setNormalContent(outputData.content); break
                    }
                }
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

        let submitContent = getCurrentContent()
        if (outputType === 'feynman') {
            if (!feynmanSimple.trim()) {
                toast.error('専門用語を使わずに説明する内容を入力してください')
                return
            }
            submitContent = JSON.stringify({
                simple: feynmanSimple,
                analogy: feynmanAnalogy
            })
        } else {
            if (!submitContent.trim()) {
                toast.error('アウトプット内容を入力してください')
                return
            }
        }

        try {
            if (output) {
                await updateOutput(id, submitContent, outputType)
            } else {
                await createOutput(id, submitContent, outputType)
            }
            toast.success('保存しました')
            navigate('/home')
        } catch (error) {
            toast.error('保存に失敗しました')
            console.error('アウトプットの保存に失敗しました', error)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentContent(e.target.value)
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
        setMermaidContent(`graph TD\n  A[開始] --> B[処理]\n  B --> C[終了]`)
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            suppressErrorRendering: true
        })
    }, [])

    useLayoutEffect(() => {
        if (outputType !== 'mermaid' || !mermaidContent || !mermaidRef.current) return

        mermaid.render('mermaid-preview', mermaidContent)
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
    }, [mermaidContent, outputType, loading])


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

                <p className="text-sm text-gray-600 mb-2 px-1">
                    {outputTypeInfo[outputType].description}
                </p>
                <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 mb-4 px-1 flex items-center gap-1"
                >
                    {showGuide ? '▲' : '▼'} 使い方・向いている学習内容を見る
                </button>

                {showGuide && (
                    <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-indigo-900 mb-1">📚 向いている学習内容</p>
                            <ul className="space-y-1">
                                {outputTypeInfo[outputType].suitable.map((item, i) => (
                                    <li key={i} className="text-xs text-indigo-800">• {item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-indigo-900 mb-1">📝 使い方</p>
                            <ol className="space-y-1">
                                {outputTypeInfo[outputType].steps.map((step, i) => (
                                    <li key={i} className="text-xs text-indigo-800">{i + 1}. {step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6">
                        {outputType === 'mermaid' ? (
                            <MermaidOutput
                                content={mermaidContent}
                                onChange={handleChange}
                                mermaidRef={mermaidRef}
                                mermaidTextareaRef={mermaidTextareaRef}
                                mermaidEditorHeight={mermaidEditorHeight}
                                onResize={handleMermaidResize}
                                showHint={showHint}
                                onToggleHint={() => setShowHint(!showHint)}
                                onInsertTemplate={insertMermaidTemplate}
                            />
                        ) : outputType === 'speed_write' ? (
                            <SpeedWriteOutput
                                content={speedWriteContent}
                                onChange={handleChange}
                                timeLeft={timeLeft}
                                isTimerRunning={isTimerRunning}
                                isTimeUp={isTimeUp}
                                onStartTimer={() => setIsTimerRunning(true)}
                            />
                        ) : outputType === 'feynman' ? (
                            <FeynmanOutput
                                feynmanSimple={feynmanSimple}
                                feynmanAnalogy={feynmanAnalogy}
                                onChangeSimple={(e) => setFeynmanSimple(e.target.value)}
                                onChangeAnalogy={(e) => setFeynmanAnalogy(e.target.value)}
                            />
                        ) : (
                            <NormalOutput
                                content={getCurrentContent()}
                                onChange={handleChange}
                            />
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