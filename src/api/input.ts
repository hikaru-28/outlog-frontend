import { fetchWithAuth, BASE_URL } from './client'

const url = BASE_URL

const getAllInputs = async (page: number = 1, limit: number = 10) => {
    const res = await fetchWithAuth(`${url}/inputs?page=${page}&limit=${limit}`)
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const getInputById = async (id: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${id}`)
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const createInput = async (title: string, type: string, memo?: string) => {
    const res = await fetchWithAuth(`${url}/inputs`, {
        method: 'POST',
        body: JSON.stringify({ title, type, memo })
    })
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const updateInput = async (id: string, title: string, type: string, memo?: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, type, memo })
    });
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const deleteInput = async (id: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${id}`, {
        method: 'DELETE',
    })
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    return true
}

export { getAllInputs, getInputById, createInput, updateInput, deleteInput }