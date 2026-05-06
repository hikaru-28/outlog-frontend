import type { FormEvent, ChangeEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <div>
            <h1>アカウント登録</h1>
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
            <Button onClick={handleSubmit}>登録</Button>
        </div>
    )
}

export default RegisterPage