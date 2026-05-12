import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllInputs, deleteInput } from '@/api/input'
import { Button } from '@/components/ui/button'
import { LogOut, Plus, Edit2, Trash2, FileText, BookOpen, PlayCircle, FileCheck, Clock, AlertCircle } from 'lucide-react'
import type { Input } from '../types'
import { toast } from 'sonner'

const HomePage = () => {
    const [inputs, setInputs] = useState<Input[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

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
            if (window.confirm('本当に削除しますか？')) {
                await deleteInput(id)
                toast.success('削除に成功しました')
                fetchInputs()
            }
        } catch (error) {
            toast.error('削除に失敗しました')
        }
    }

    const isOverdue = (createdAt: string) => {
        const now = new Date()
        const created = new Date(createdAt)
        const diff = now.getTime() - created.getTime()
        return diff > 24 * 60 * 60 * 1000
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))

        if (hours < 24) {
            return `${hours}時間前`
        } else {
            const days = Math.floor(hours / 24)
            return `${days}日前`
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case '本':
                return <BookOpen className="w-5 h-5" />
            case 'Youtube':
                return <PlayCircle className="w-5 h-5" />
            case '記事':
                return <FileText className="w-5 h-5" />
            default:
                return <FileText className="w-5 h-5" />
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        fetchInputs()
    }, [currentPage])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Outlog</h1>
                    <Button
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        ログアウト
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">インプット一覧</h2>
                        <p className="text-gray-600 mt-1">{inputs.length}件のインプット</p>
                    </div>
                    <Link to='/inputs/new'>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                            <Plus className="w-5 h-5 mr-2" />
                            新規インプット
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-500">読み込み中...</div>
                ) : inputs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">インプットがありません</h3>
                        <p className="text-gray-500 mb-6">新しいインプットを作成して学習を始めましょう</p>
                        <Link to='/inputs/new'>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Plus className="w-5 h-5 mr-2" />
                                最初のインプットを作成
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {inputs.map((input) => {
                            const overdue = isOverdue(input.createdAt) && !input.isOutputDone
                            return (
                                <div
                                    key={input.id}
                                    className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`p-3 rounded-lg ${input.isOutputDone ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {getTypeIcon(input.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{input.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                    <span className="inline-flex items-center gap-1">
                                                        <FileText className="w-4 h-4" />
                                                        {input.type}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDate(input.createdAt)}
                                                    </span>
                                                </div>
                                                {input.memo && (
                                                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{input.memo}</p>
                                                )}
                                                {overdue && (
                                                    <div className="flex items-center gap-2 mt-3 text-red-600 text-sm font-medium">
                                                        <AlertCircle className="w-4 h-4" />
                                                        インプットから24時間経過しています
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${input.isOutputDone
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {input.isOutputDone ? '✓ 完了' : '未完了'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                        <Link to={`/inputs/${input.id}/output`} className="flex-1">
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                                <FileCheck className="w-4 h-4 mr-2" />
                                                アウトプット
                                            </Button>
                                        </Link>
                                        <Link to={`/inputs/${input.id}/edit`}>
                                            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                編集
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleDelete(input.id)}
                                            className="bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                )}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:opacity-50"
                    >
                        前へ
                    </Button>
                    <p className="text-gray-600 font-medium">{currentPage} / {totalPage}</p>
                    <Button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage >= totalPage || totalPage === 0}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:opacity-50"
                    >
                        次へ
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default HomePage