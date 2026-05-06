import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from '../api/auth'



const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください');
            return
        }

        const result = await login(email, password)
        if (result) {
            navigate('/')
        }
    }

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    return (
        <div>
            <h1>ログイン</h1>
            <Input
                value={email}
                onChange={handleChangeEmail}
                placeholder="メールアドレス"
            />
            <Input
                value={password}
                onChange={handleChangePassword}
                type="password"
                placeholder="パスワード"
            />
            <Button onClick={handleSubmit}>ログイン</Button>
            <Link to='/register'>アカウント登録はこちら</Link>
        </div>
    )
}

export default LoginPage