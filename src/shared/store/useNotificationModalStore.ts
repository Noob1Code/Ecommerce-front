import { create } from 'zustand';

export type ModalType = 'success' | 'error' | 'confirm';

interface ModalOptions {
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface NotificationModalState {
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    showSuccess: (options: Omit<ModalOptions, 'onCancel'>) => void;
    showError: (options: Omit<ModalOptions, 'onCancel' | 'onConfirm'>) => void;
    showConfirm: (options: ModalOptions) => void;
    close: () => void;
}

export const useNotificationModalStore = create<NotificationModalState>((set) => ({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    showSuccess: (options) => set({
        isOpen: true,
        type: 'success',
        title: options.title,
        message: options.message,
        onConfirm: options.onConfirm || null,
        onCancel: null,
    }),
    showError: (options) => set({
        isOpen: true,
        type: 'error',
        title: options.title,
        message: options.message,
        onConfirm: null,
        onCancel: null,
    }),
    showConfirm: (options) => set({
        isOpen: true,
        type: 'confirm',
        title: options.title,
        message: options.message,
        onConfirm: options.onConfirm || null,
        onCancel: options.onCancel || null,
    }),
    close: () => set({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
    }),
}));