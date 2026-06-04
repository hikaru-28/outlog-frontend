import { fetchWithAuth, BASE_URL } from './client'

const getStreak = async () => {
    const res = await fetchWithAuth(`${BASE_URL}/stats/streak`)
    if (!res) return
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
    }
    const data = await res.json()
    return data
}

export { getStreak }