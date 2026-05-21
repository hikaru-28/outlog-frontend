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
                <h1>Outlog</h1>
                <div>
                    <Link to='/login'>ログイン</Link>
                    <Link to='/register'>新規登録</Link>
                </div>
            </header>

            {/* ② ヒーローセクション */}
            <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 text-center">
                <h2>インプットを、アウトプットへ。</h2>
                <p>学んだことを記録し、知識を定着させる学習習慣化サービス</p>
                <Link to='/register'>無料で始める</Link>
            </section>

            {/* ③ 機能紹介 */}
            <section>
                {/* 3つのカード */}
            </section>

            {/* ④ フッター */}
            <footer>
                <p>© 2026 Outlog</p>
            </footer>
        </div>
    )
}

export default LandingPage