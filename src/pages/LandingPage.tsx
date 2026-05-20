import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <div>
            {/* ① ヘッダー */}
            <header>
                <h1>Outlog</h1>
                <div>
                    <Link to='/login'>ログイン</Link>
                    <Link to='/register'>新規登録</Link>
                </div>
            </header>

            {/* ② ヒーローセクション */}
            <section>
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