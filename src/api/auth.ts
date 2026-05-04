const url = 'http://localhost:3000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
});

const register = async (email: string, password: string) => {
    try {
        const res = await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            throw new Error(`ユーザー登録に失敗しました: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('ユーザー登録に失敗しました:', error)
    }
}

export { register };

