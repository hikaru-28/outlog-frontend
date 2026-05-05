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
        if (!res.ok) throw new Error(`outputの取得に失敗しました`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('outputの取得に失敗しました', error);
    }
}

export { getOutputsByInputId };