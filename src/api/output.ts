import { fetchWithAuth, BASE_URL } from "./client"

const url = BASE_URL

const getOutputsByInputId = async (inputId: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`)
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const createOutput = async (inputId: string, content: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`, {
        method: 'POST',
        body: JSON.stringify({ content })
    });
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

const updateOutput = async (inputId: string, content: string) => {
    const res = await fetchWithAuth(`${url}/inputs/${inputId}/output`, {
        method: 'PATCH',
        body: JSON.stringify({ content })
    })
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

export { getOutputsByInputId, createOutput, updateOutput };