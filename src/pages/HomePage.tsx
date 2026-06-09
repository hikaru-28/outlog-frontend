import useInputs from '@/hooks/useInputs'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Plus, Edit2, Trash2, FileText, BookOpen, PlayCircle, FileCheck, Clock, AlertCircle, GraduationCap, Search } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const HomePage = () => {
    const {
        inputs, currentPage, totalPage, loading, setCurrentPage, handleDelete,
        keyword, setKeyword,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        sort, setSort,
    } = useInputs()
    const navigate = useNavigate()

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

    const getTypeIcon = (type: string, size: string = 'w-5 h-5') => {
        switch (type) {
            case '本':
                return <BookOpen className={size} />
            case 'Youtube':
                return <PlayCircle className={size} />
            case '記事':
                return <FileText className={size} />
            case '講義':
                return <GraduationCap className={size} />
            default:
                return <FileText className={size} />
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const delayClass = ['', 'animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-400']

    return (
        <div className="animate-fade-in min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Outlog</h1>
                    <div className="flex items-center gap-3">
                        <Link to='/stats'>
                            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100">
                                統計
                            </Button>
                        </Link>
                        <Button
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            ログアウト
                        </Button>
                    </div>

                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">インプット一覧</h2>
                        <p className="text-gray-600 mt-1">{inputs.length}件のインプット</p>
                    </div>
                    <Link to='/inputs/new'>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-transform duration-100">
                            <Plus className="w-5 h-5 mr-2" />
                            新規インプット
                        </Button>
                    </Link>
                </div>

                {/* 検索・フィルタ */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="キーワード検索..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                        <option value="">すべてのタイプ</option>
                        <option value="本">📚 本</option>
                        <option value="Youtube">🎥 Youtube</option>
                        <option value="記事">📄 記事</option>
                        <option value="講義">🪧 講義</option>
                    </select>
                    <select
                        value={filterStatus === undefined ? '' : String(filterStatus)}
                        onChange={(e) => setFilterStatus(e.target.value === '' ? undefined : e.target.value === 'true')}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                        <option value="">すべての状態</option>
                        <option value="false">未完了</option>
                        <option value="true">完了</option>
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                        <option value="desc">新しい順</option>
                        <option value="asc">古い順</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-32 w-full" />
                        ))}
                    </div>
                ) : inputs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">インプットがありません</h3>
                        <p className="text-gray-500 mb-6">新しいインプットを作成して学習を始めましょう</p>
                        <Link to='/inputs/new'>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-transform duration-100">
                                <Plus className="w-5 h-5 mr-2" />
                                最初のインプットを作成
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {inputs.map((input, index) => {
                            const overdue = isOverdue(input.createdAt) && !input.isOutputDone
                            return (
                                <div
                                    key={input.id}
                                    className={`animate-slide-up ${delayClass[index % 5]} bg-white rounded-xl border-2 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
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
                                                        {getTypeIcon(input.type, 'w-4 h-4')}
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

                                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                                        <Link to={`/inputs/${input.id}/output`} className="sm:flex-1">
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-transform duration-100">
                                                <FileCheck className="w-4 h-4 mr-2" />
                                                アウトプット
                                            </Button>
                                        </Link>
                                        <div className="flex gap-2">
                                            <Link to={`/inputs/${input.id}/edit`} className="flex-1 sm:flex-none">
                                                <Button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-95 transition-transform duration-100">
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    編集
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                {/* これをクリックするとダイアログが開く */}
                                                <AlertDialogTrigger asChild>
                                                    <Button className="bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300 active:scale-95 transition-transform duration-100">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                {/* ダイアログの中身 */}
                                                <AlertDialogContent className="bg-white">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            この操作は取り消せません。
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(input.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            削除
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:opacity-50 active:scale-95 transition-transform duration-100"
                    >
                        前へ
                    </Button>
                    <p className="text-gray-600 font-medium">{currentPage} / {totalPage}</p>
                    <Button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage >= totalPage || totalPage === 0}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:opacity-50 active:scale-95 transition-transform duration-100"
                    >
                        次へ
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default HomePage