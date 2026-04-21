import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback((message, type = "info") => {
		const id = Date.now() + Math.random();
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			removeToast(id);
		}, 2500);
	}, [removeToast]);

	const value = useMemo(() => ({ showToast }), [showToast]);

	const toastTypeClass = {
		success: "bg-green-600 text-white",
		error: "bg-red-600 text-white",
		info: "bg-gray-900 text-white",
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium min-w-[220px] ${toastTypeClass[toast.type] || toastTypeClass.info}`}
					>
						{toast.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}
