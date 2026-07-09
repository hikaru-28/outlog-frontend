import type { ChangeEvent } from "react"

type NormalOutputProps = {
    content: string
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const NormalOutput = ({ content, onChange }: NormalOutputProps) => {
    return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                アウトプット内容 <span className="text-red-500">*</span>
            </label>
            <textarea
                placeholder="学んだことをアウトプットしましょう...&#10;&#10;例:&#10;・〇〇について理解を深めた&#10;・△△の仕組みが分かった&#10;・実際の業務で××に活かせそう"
                name="content"
                value={content}
                onChange={onChange}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">学んだ内容を自分の言葉でまとめましょう</p>
                <p className="text-xs text-gray-400">{content.length}文字</p>
            </div>
        </>
    )
}

export default NormalOutput