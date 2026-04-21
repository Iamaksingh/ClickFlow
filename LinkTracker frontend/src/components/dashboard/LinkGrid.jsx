import DashboardLinkCard from "./DashboardLinkCard";

export default function LinkGrid({
	links,
	loading,
	onCopyLink,
	onOpenAnalytics,
	onDeleteLink,
}) {
	if (loading) {
		return <p className="text-gray-500">Loading...</p>;
	}

	if (links.length === 0) {
		return <div className="text-center text-gray-500 mt-10">No links yet. Create one above 🚀</div>;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{links.map((link) => (
				<DashboardLinkCard
					key={link._id}
					link={link}
					onCopyLink={onCopyLink}
					onOpenAnalytics={onOpenAnalytics}
					onDeleteLink={onDeleteLink}
				/>
			))}
		</div>
	);
}
