export default function DeviceAnalyticsChart({ deviceAnalytics }) {
    if (!deviceAnalytics || deviceAnalytics.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Device Analytics</p>
                <p className="text-gray-600 mt-2">No data available</p>
            </div>
        );
    }

    const total = deviceAnalytics.reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-semibold mb-4">Device Analytics</p>
            <div className="space-y-3">
                {deviceAnalytics.map((device) => {
                    const percentage = total > 0 ? ((device.count / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={device.device}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {device.device}
                                </span>
                                <span className="text-xs font-semibold text-gray-600">
                                    {device.count} ({percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
