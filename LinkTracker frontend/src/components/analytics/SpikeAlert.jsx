export default function SpikeAlert({ spikeDetection }) {
    if (!spikeDetection) {
        return null;
    }

    const { hasSpike, todayClicks, threshold, spikePercentage } = spikeDetection;

    if (!hasSpike) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="text-blue-600 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900">Normal Activity</p>
                        <p className="text-sm text-blue-700">Today: {todayClicks} clicks (Threshold: {threshold})</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <div className="text-red-600 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25l5.25-5.25m0 0l5.25 5.25m-10.5-5.25l5.25 5.25m0 0l5.25-5.25" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-red-900">Spike Detected 🚀</p>
                    <p className="text-sm text-red-700">
                        Today: {todayClicks} clicks - {spikePercentage > 0 ? `+${spikePercentage}%` : `${spikePercentage}%`} above average!
                    </p>
                </div>
            </div>
        </div>
    );
}
