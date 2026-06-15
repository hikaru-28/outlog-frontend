import { Link } from 'react-router-dom'
import { BookOpen, FileText, AlertCircle } from 'lucide-react'

const LandingPage = () => {
    const features = [
        { icon: <BookOpen />, title: 'インプット管理', description: '本・YouTube・記事をまとめて記録' },
        { icon: <FileText />, title: 'アウトプット記録', description: '学んだことを自分の言葉でまとめる' },
        { icon: <AlertCircle />, title: '24時間リマインド', description: '未完了のインプットを見逃さない' },
    ]

    return (
        <div>
            {/* ① ヘッダー */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-indigo-600">Outlog</h1>
                <div className="flex gap-3">
                    <Link to='/login' className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">ログイン</Link>
                    <Link to='/register' className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">新規登録</Link>
                </div>
            </header>

            {/* ② ヒーローセクション */}
            <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 text-center">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">インプットを、アウトプットへ。</h2>
                <p className="text-xl text-gray-600 mb-10">学んだことを記録し、知識を定着させる学習習慣化サービス</p>
                <Link to='/register' className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 shadow-lg">無料で始める</Link>
            </section>

            {/* ③ 機能紹介 */}
            {/* ③ 機能紹介 */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Outlogでできること
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ④ フッター */}
            <footer className="bg-gray-50 border-t border-gray-200 py-8 text-center">
                <p className="text-gray-500 text-sm">© 2026 Outlog</p>
            </footer>
        </div>
    )
}

export default LandingPage