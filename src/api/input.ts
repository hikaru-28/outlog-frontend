import { fetchWithAuth, BASE_URL } from './client'

const url = BASE_URL

const getAllInputs = async () => {
    try {
        const res = await fetchWithAuth(`${url}/inputs`)
        if (!res) return
        if (!res.ok) throw new Error(`inputの取得に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('inputの取得に失敗しました:', error)
    }
}

const getInputById = async (id: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${id}`)
        if (!res) return
        if (!res.ok) throw new Error(`inputの取得に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('inputの取得に失敗しました:', error)
    }
}

const createInput = async (title: string, type: string, memo?: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs`, {
            method: 'POST',
            body: JSON.stringify({ title, type, memo })
        })
        if (!res) return
        if (!res.ok) throw new Error(`inputの作成に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('inputの作成に失敗しました', error)
    }
}

const updateInput = async (id: string, title: string, type: string, memo?: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title, type, memo })
        });
        if (!res) return
        if (!res.ok) throw new Error(`inputの更新に失敗しました: ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('inputの更新に失敗しました', error)
    }
}

const deleteInput = async (id: string) => {
    try {
        const res = await fetchWithAuth(`${url}/inputs/${id}`, {
            method: 'DELETE',
        })
        if (!res) return
        if (!res.ok) throw new Error(`inputの削除に失敗しました: ${res.status}`)
        return true
    } catch (error) {
        console.error('inputの削除に失敗しました', error)
    }
}

export { getAllInputs, getInputById, createInput, updateInput, deleteInput }