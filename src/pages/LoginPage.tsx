import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from '../api/auth'
import { LogIn, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()


        if (!email || !password) {
            toast.error('メールアドレスとパスワードを入力してください')
            return
        }

        const toastId = toast.loading('ログイン中...')
        try {
            await login(email, password)
            toast.dismiss(toastId)
            toast.success('ログインしました')
            navigate('/')
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error instanceof Error ? error.message : 'ログインに失敗しました')
        }
    }

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
                        <span className="text-2xl font-bold text-white">O</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Outlog</h1>
                    <p className="text-gray-600">学びを記録し、成長を可視化する</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            メールアドレス
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={email}
                                onChange={handleChangeEmail}
                                placeholder="example@email.com"
                                type="email"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            パスワード
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={password}
                                onChange={handleChangePassword}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button className="text-white w-full bg-indigo-600 hover:bg-indigo-700 shadow-md" type="submit">
                        <LogIn className="w-5 h-5 mr-2" />
                        ログイン
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        アカウントをお持ちでない方は{' '}
                        <Link to='/register' className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                            こちらから登録
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage