import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { register } from '../api/auth'

const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください');
            return
        }

        const result = await register(email, password)
        if (result) {
            navigate('/login')
        }
    }

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-indigo-600 text-center mb-2">Outlog</h1>
                <p className="text-gray-500 text-center mb-6">ユーザー登録</p>

                <div className="space-y-4">
                    <Input
                        value={email}
                        onChange={handleChangeEmail}
                        placeholder='メールアドレス'
                    />
                    <Input
                        value={password}
                        onChange={handleChangePassword}
                        type='password'
                        placeholder='パスワード'
                    />
                    <Button className="text-white w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSubmit}>
                        登録
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        <Link to='/login' className="text-indigo-600 hover:underline">
                            ログインはこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage