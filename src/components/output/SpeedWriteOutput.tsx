import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"

type SpeedWriteOutputProps = {
    content: string
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    timeLeft: number
    isTimerRunning: boolean
    isTimeUp: boolean
    onStartTimer: () => void
}

const SpeedWriteOutput = ({ content, onChange, timeLeft, isTimerRunning, isTimeUp, onStartTimer }: SpeedWriteOutputProps) => {
    return (
        <>
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-600">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
                {!isTimerRunning && !isTimeUp && (
                    <Button
                        type="button"
                        onClick={onStartTimer}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        スタート
                    </Button>
                )}
                {isTimeUp && (
                    <span className="text-orange-600 font-medium">時間切れです！</span>
                )}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                アウトプット内容 <span className="text-red-500">*</span>
            </label>
            <textarea
                placeholder="学んだことをアウトプットしましょう..."
                value={content}
                onChange={onChange}
                rows={12}
                disabled={isTimeUp}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">タイマーが鳴るまで書き続けましょう</p>
                <p className="text-xs text-gray-400">{content.length}文字</p>
            </div>
        </>

    )
}

export default SpeedWriteOutput