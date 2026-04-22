export default function ConfirmationModal({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDangerous = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm mx-4 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                    <p className="text-gray-600 text-sm mb-6">{message}</p>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${isDangerous
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
