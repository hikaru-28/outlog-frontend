import { fetchWithAuth, BASE_URL } from "./client"

const url = BASE_URL

const getOutputsByInputId = async (inputId: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`)
        if (!res) return
        if (!res.ok) throw new Error(`outputの取得に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('outputの取得に失敗しました', error)
    }
}

const createOutput = async (inputId: string, content: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
        if (!res) return
        if (!res.ok) throw new Error(`outputの作成に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('outputの作成に失敗しました', error)
    }
}

const updateOutput = async (inputId: string, content: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`, {
            method: 'PATCH',
            body: JSON.stringify({ content })
        })
        if (!res) return
        if (!res.ok) throw new Error(`outputの更新に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('outputの更新に失敗しました', error)
    }
}

export { getOutputsByInputId, createOutput, updateOutput };