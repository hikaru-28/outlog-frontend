import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllInputs } from '@/api/input'
import { getStreak } from '@/api/stats'
import type { Input } from '../types'
import { toast } from 'sonner'
import { Pie, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js'

// 必要なコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const StatsPage = () => {
    const [inputs, setInputs] = useState<Input[]>([])
    const [loading, setLoading] = useState(true)

    // streakのstate
    const [currentStreak, setCurrentStreak] = useState(0)
    const [longestStreak, setLongestStreak] = useState(0)
    const [activityData, setActivityData] = useState<{ date: string, count: number }[]>([])

    const fetchAllInputs = async () => {
        try {
            const data = await getAllInputs(1, 1000)
            setInputs(data.inputs)
        } catch (error) {
            toast.error('データの取得に失敗しました')
            console.error('データの取得に失敗しました', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStreak = async () => {
        try {
            const data = await getStreak()
            if (!data) return
            setCurrentStreak(data.currentStreak)
            setLongestStreak(data.longestStreak)
            setActivityData(data.activityData)
        } catch (error) {
            toast.error('ストリークの取得を失敗しました')
            console.error('ストリークの取得に失敗しました', error)
        } finally {
            setLoading(false)
        }
    }

    // データ計算

    const totalCount = inputs.length
    const doneCount = inputs.filter(input => input.isOutputDone).length
    const completionRate = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)

    // タイプ別

    const typeCount = inputs.reduce((acc, input) => {
        acc[input.type] = (acc[input.type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value }))

    // 完了・未完了
    const statusData = [
        { name: '完了', value: doneCount },
        { name: '未完了', value: totalCount - doneCount }
    ]

    // カラー

    const COLORS = ['#4F46E5', '#7C3AED', '#2563EB', '#0891B2', '#059669']

    // 円グラフのデータ形式
    const pieData = {
        labels: typeData.map(d => d.name),
        datasets: [{
            data: typeData.map(d => d.value),
            backgroundColor: COLORS,
        }]
    }

    // 棒グラフのデータ形式
    const barData = {
        labels: statusData.map(d => d.name),
        datasets: [{
            label: '件数',
            data: statusData.map(d => d.value),
            backgroundColor: ['#4F46E5', '#E5E7EB'],
        }]
    }

    useEffect(() => {
        fetchAllInputs()
        fetchStreak()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Outlog</h1>
                    <Link to='/home' className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">ホームに戻る</Link>
                </div>
            </div>


            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ストリーク */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 text-sm">現在の連続日数</p>
                        <p className="text-4xl font-bold text-orange-500 mt-2">🔥 {currentStreak}日</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 text-sm">最長連続日数</p>
                        <p className="text-4xl font-bold text-yellow-500 mt-2">⭐ {longestStreak}日</p>
                    </div>
                </div>

                {/* カレンダー */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">アクティビティ（過去1年）</h2>
                    <div className="overflow-x-auto">
                        {/* 月ラベル */}
                        <div className="flex gap-1 mb-1">
                            {Array.from({ length: Math.ceil(activityData.length / 7) }, (_, weekIndex) => {
                                const firstDay = activityData[weekIndex * 7]
                                if (!firstDay) return <div key={weekIndex} className="w-4" />
                                const date = new Date(firstDay.date)
                                const isFirstWeekOfMonth = date.getDate() <= 7
                                return (
                                    <div key={weekIndex} className="w-4 text-xs text-gray-400">
                                        {isFirstWeekOfMonth ? `${date.getMonth() + 1}月` : ''}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(activityData.length / 7) }, (_, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {activityData.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => (
                                        <div
                                            key={day.date}
                                            title={`${day.date}: ${day.count}件`}
                                            className={`w-4 h-4 rounded-sm ${day.count === 0 ? 'bg-gray-100' :
                                                day.count === 1 ? 'bg-indigo-200' :
                                                    day.count === 2 ? 'bg-indigo-400' :
                                                        'bg-indigo-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* 凡例 */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                        <span>少ない</span>
                        <div className="w-4 h-4 rounded-sm bg-gray-100" />
                        <div className="w-4 h-4 rounded-sm bg-indigo-200" />
                        <div className="w-4 h-4 rounded-sm bg-indigo-400" />
                        <div className="w-4 h-4 rounded-sm bg-indigo-600" />
                        <span>多い</span>
                    </div>
                </div>

                {/* 統計カード */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 text-sm">総インプット数</p>
                        <p className="text-4xl font-bold text-indigo-600 mt-2">{totalCount}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 text-sm">完了数</p>
                        <p className="text-4xl font-bold text-green-600 mt-2">{doneCount}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 text-sm">完了率</p>
                        <p className="text-4xl font-bold text-purple-600 mt-2">{completionRate}%</p>
                    </div>
                </div>

                {/* グラフ */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">タイプ別内訳</h2>
                        <Pie data={pieData} />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">完了・未完了</h2>
                        <Bar data={barData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsPage
