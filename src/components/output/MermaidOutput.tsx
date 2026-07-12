import type { ChangeEvent, RefObject } from "react"

type MermaidOutputProps = {
    content: string
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    mermaidRef: RefObject<HTMLDivElement>
    mermaidTextareaRef: RefObject<HTMLTextAreaElement>
    mermaidEditorHeight: number
    onResize: () => void
    showHint: boolean
    onToggleHint: () => void
    onInsertTemplate: () => void
}

const MermaidOutput = ({ content, onChange, mermaidRef, mermaidTextareaRef, mermaidEditorHeight, onResize, showHint, onToggleHint, onInsertTemplate }: MermaidOutputProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mermaidコード <span className="text-red-500">*</span>
                </label>

                <button
                    type="button"
                    onClick={onToggleHint}
                    className="text-xs text-indigo-600 hover:text-indigo-700 mb-2 flex items-center gap-1"
                >
                    {showHint ? '▲' : '▼'} 記法のヒントを表示
                </button>

                {showHint && (
                    <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-gray-700 space-y-2">
                        <div>
                            <p className="font-medium text-indigo-900">矢印でつなぐ：</p>
                            <code className="block bg-white px-2 py-1 rounded mt-1">A --&gt; B</code>
                        </div>
                        <div>
                            <p className="font-medium text-indigo-900">ボックスに文字を入れる：</p>
                            <code className="block bg-white px-2 py-1 rounded mt-1">A[開始] --&gt; B[終了]</code>
                        </div>
                        <div>
                            <p className="font-medium text-indigo-900">条件分岐：</p>
                            <code className="block bg-white px-2 py-1 rounded mt-1">A --&gt; B{`{条件}`}<br />B --&gt;|Yes| C</code>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onInsertTemplate}
                    className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-300 hover:border-indigo-400 px-3 py-1 rounded-lg mb-2"
                >
                    📋 テンプレートを挿入
                </button>

                <textarea
                    placeholder={`例:\ngraph TD\n  A[開始] --> B[処理]\n  B --> C[終了]`}
                    value={content}
                    ref={mermaidTextareaRef}
                    onMouseUp={onResize}
                    style={{ height: `${mermaidEditorHeight}px` }}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    プレビュー
                </label>
                <div
                    ref={mermaidRef}
                    style={{ height: `${mermaidEditorHeight + 59}px` }}
                    className="w-full border border-gray-300 rounded-lg p-4 overflow-auto bg-gray-50 flex items-start justify-center [&_svg]:max-w-full [&_svg]:h-auto"
                />
            </div>
        </div>
    )
}

export default MermaidOutput