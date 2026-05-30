import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useInputs from '@/hooks/useInputs'

vi.mock('@/api/input', () => ({
    getAllInputs: vi.fn(),
    deleteInput: vi.fn(),
}))

vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}))

import { getAllInputs, deleteInput } from '@/api/input'

const mockInputs = [
    {
        id: '1',
        userId: 'user1',
        title: 'テスト本',
        type: '本',
        memo: null,
        isOutputDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

describe('useInputs', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('初期状態でfetchInputsが呼ばれること', async () => {
        ; (getAllInputs as ReturnType<typeof vi.fn>).mockResolvedValue({
            inputs: mockInputs,
            total: 1,
        })

        const { result } = renderHook(() => useInputs())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(getAllInputs).toHaveBeenCalledWith(1)
        expect(result.current.inputs).toEqual(mockInputs)
        expect(result.current.totalPage).toBe(1)
    })

    test('APIエラー時もloadingがfalseになること', async () => {
        ; (getAllInputs as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('APIエラー')
        )

        const { result } = renderHook(() => useInputs())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    test('deleteが成功したらfetchInputsが再度呼ばれること', async () => {
        ; (getAllInputs as ReturnType<typeof vi.fn>).mockResolvedValue({
            inputs: mockInputs,
            total: 1,
        })
            ; (deleteInput as ReturnType<typeof vi.fn>).mockResolvedValue({})

        const { result } = renderHook(() => useInputs())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await result.current.handleDelete('1')

        expect(deleteInput).toHaveBeenCalledWith('1')
        expect(getAllInputs).toHaveBeenCalledTimes(2) // 初回 + 削除後
    })
})