export default function ReferrerAnalyticsChart({ referrerAnalytics }) {
    if (!referrerAnalytics || referrerAnalytics.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Referrer Analytics</p>
                <p className="text-gray-600 mt-2">No data available</p>
            </div>
        );
    }

    const total = referrerAnalytics.reduce((sum, r) => sum + r.count, 0);
    const colors = [
        "bg-blue-600",
        "bg-green-600",
        "bg-purple-600",
        "bg-orange-600",
        "bg-red-600",
        "bg-pink-600",
        "bg-indigo-600",
        "bg-cyan-600",
        "bg-yellow-600",
        "bg-lime-600"
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-semibold mb-4">Top Referrers</p>
            <div className="space-y-3">
                {referrerAnalytics.map((referrer, idx) => {
                    const percentage = total > 0 ? ((referrer.count / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={referrer.referrer}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}></div>
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {referrer.referrer === "direct" ? "Direct" : referrer.referrer}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">
                                    {referrer.count} ({percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${colors[idx % colors.length]} h-2 rounded-full transition-all duration-300`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
