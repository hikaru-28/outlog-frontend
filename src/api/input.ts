
const url = 'http://localhost:3000/api';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const getAllInputs = async () => {
    try {
        const res = await fetch(`${url}/inputs`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`inputの取得に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('inputの取得に失敗しました:', error);
    }
}

const createInput = async (title: string, type: string, memo?: string) => {
    try {
        const res = await fetch(`${url}/inputs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, type, memo })
        });
        if (!res.ok) throw new Error(`inputの作成に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('inputの作成に失敗しました', error);
    }
}

export { getAllInputs, createInput };