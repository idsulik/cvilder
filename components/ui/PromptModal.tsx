import React, { useEffect, useState, useRef } from 'react';

interface PromptModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    defaultValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    title,
    message,
    defaultValue = "",
    placeholder = "",
    confirmText = "Submit",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [isOpen, defaultValue]);

    const handleSubmit = () => {
        onConfirm(value);
        setValue("");
    };

    const handleDisplayCancel = () => {
        onCancel();
        setValue("");
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    {message && <p className="text-gray-600 text-sm mb-4">{message}</p>}

                    <textarea
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full min-h-[120px] p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-100">
                    <button
                        onClick={handleDisplayCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 border border-transparent rounded-lg transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!value.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
