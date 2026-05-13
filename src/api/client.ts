const BASE_URL = import.meta.env.VITE_API_URL
const fetchWithAuth = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            ...options?.headers
        }
    })

    if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return
    }

    return res
}

export { fetchWithAuth, BASE_URL }