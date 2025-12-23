import React, { createContext, useContext, useState } from 'react';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PromptModal } from '../components/ui/PromptModal';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

interface PromptOptions {
    title: string;
    message?: string;
    defaultValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
}

interface UIContextType {
    openApiKeyModal: () => void;
    closeApiKeyModal: () => void;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    prompt: (options: PromptOptions) => Promise<string | null>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    // Confirm State
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean, options: ConfirmOptions, resolve: (val: boolean) => void } | null>(null);

    // Prompt State
    const [promptState, setPromptState] = useState<{ isOpen: boolean, options: PromptOptions, resolve: (val: string | null) => void } | null>(null);

    const openApiKeyModal = () => setIsApiKeyModalOpen(true);
    const closeApiKeyModal = () => setIsApiKeyModalOpen(false);

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                options,
                resolve
            });
        });
    };

    const handleConfirmClose = (result: boolean) => {
        if (confirmState) {
            confirmState.resolve(result);
            setConfirmState(null);
        }
    };

    const prompt = (options: PromptOptions): Promise<string | null> => {
        return new Promise((resolve) => {
            setPromptState({
                isOpen: true,
                options,
                resolve
            });
        });
    };

    const handlePromptClose = (result: string | null) => {
        if (promptState) {
            promptState.resolve(result);
            setPromptState(null);
        }
    };

    return (
        <UIContext.Provider value={{ openApiKeyModal, closeApiKeyModal, confirm, prompt }}>
            {children}
            <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={closeApiKeyModal} />

            {confirmState && (
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    {...confirmState.options}
                    onConfirm={() => handleConfirmClose(true)}
                    onCancel={() => handleConfirmClose(false)}
                />
            )}

            {promptState && (
                <PromptModal
                    isOpen={promptState.isOpen}
                    {...promptState.options}
                    onConfirm={(val) => handlePromptClose(val)}
                    onCancel={() => handlePromptClose(null)}
                />
            )}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
