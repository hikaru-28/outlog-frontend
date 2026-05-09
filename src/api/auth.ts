import { BASE_URL } from "./client"

const url = BASE_URL

const getHeaders = () => ({
    'Content-Type': 'application/json',
});

const register = async (email: string, password: string) => {
    const res = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }

    const data = await res.json()
    return data

}

const login = async (email: string, password: string) => {
    const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)
    return data
}

export { register, login }

