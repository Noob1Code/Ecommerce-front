import { useNotificationModalStore } from '../../store/useNotificationModalStore';
import { Button } from './Button';

export const NotificationModal = () => {
    const { isOpen, type, title, message, onConfirm, onCancel, close } = useNotificationModalStore();

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        close();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className="w-full max-w-md overflow-hidden bg-white border border-gray-100 p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center"
                role="dialog"
                aria-modal="true"
            >
                {/* Dynamic Status Icon Configuration */}
                {type === 'success' && (
                    <div className="h-14 w-14 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-2xs">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {type === 'error' && (
                    <div className="h-14 w-14 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-2xs">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                )}

                {type === 'confirm' && (
                    <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-2xs">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">{title}</h2>
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">{message}</p>

                {/* Operational Control Triggers */}
                <div className="flex w-full gap-2 justify-center">
                    {type === 'confirm' ? (
                        <>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                className="w-full py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleConfirm}
                                className="w-full py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                            >
                                Confirm
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleConfirm}
                            className={`w-full max-w-[160px] py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl text-white shadow-xs ${type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            Okay
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};