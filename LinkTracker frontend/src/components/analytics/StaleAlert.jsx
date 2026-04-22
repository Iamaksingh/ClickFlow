export default function StaleAlert({ staleStatus }) {
    if (!staleStatus) {
        return null;
    }

    const { isStale, lastClickDate, daysInactive } = staleStatus;

    if (!isStale) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-green-900">Link Active</p>
                        <p className="text-sm text-green-700">Last accessed: {lastClickDate}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <div className="text-yellow-600 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-yellow-900">Link Inactive</p>
                    <p className="text-sm text-yellow-700">
                        {daysInactive ? `No clicks in ${daysInactive} days` : "No clicks recorded"}
                    </p>
                </div>
            </div>
        </div>
    );
}
