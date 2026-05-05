const url = 'http://localhost:3000/api';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const getOutputsByInputId = async (inputId: string) => {
    try {
        const res = await fetch(`${url}/inputs/${inputId}/output`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`outputの取得に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('outputの取得に失敗しました', error);
    }
}

const createOutput = async (inputId: string, content: string) => {
    try {
        const res = await fetch(`${url}/inputs/${inputId}/output`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content })
        });
        if (!res.ok) throw new Error(`outputの作成に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('outputの作成に失敗しました', error);
    }
}

const updateOutput = async (inputId: string, content: string) => {
    try {
        const res = await fetch(`${url}/inputs/${inputId}/output`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content })
        });
        if (!res.ok) throw new Error(`outputの更新に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('outputの更新に失敗しました', error);
    }
}

export { getOutputsByInputId, createOutput, updateOutput };