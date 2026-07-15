import type { ChangeEvent } from "react";

type FeynmanOutputProps = {
    feynmanSimple: string;
    feynmanAnalogy: string;
    onChangeSimple: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onChangeAnalogy: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const FeynmanOutput = ({ feynmanSimple, feynmanAnalogy, onChangeSimple, onChangeAnalogy }: FeynmanOutputProps) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    専門用語を使わずに説明する <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">小学生に説明するつもりで、難しい言葉を使わずに書いてみましょう</p>
                <textarea
                    placeholder="例：useEffectは、画面が表示された後に「何かをする」ための仕組みです..."
                    value={feynmanSimple}
                    onChange={onChangeSimple}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                    <p className="text-xs text-gray-400">{feynmanSimple.length}文字</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    例え話で説明する
                </label>
                <p className="text-xs text-gray-500 mb-2">日常生活の何かに例えて説明してみましょう（任意）</p>
                <textarea
                    placeholder="例：useEffectは、料理が完成した後に「いただきます」と言う瞬間のようなものです..."
                    value={feynmanAnalogy}
                    onChange={onChangeAnalogy}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                    <p className="text-xs text-gray-400">{feynmanAnalogy.length}文字</p>
                </div>
            </div>
        </div>
    )
}

export default FeynmanOutput