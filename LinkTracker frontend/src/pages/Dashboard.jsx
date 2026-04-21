import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLinks, createLink, logoutUser, deleteLink } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import LoggedOutState from "../components/dashboard/LoggedOutState.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import CreateLinkForm from "../components/dashboard/CreateLinkForm.jsx";
import LinkGrid from "../components/dashboard/LinkGrid.jsx";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	const [url, setUrl] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const { showToast } = useToast();

	//fetch all user links
	const fetchLinks = async () => {
		try {
			setLoading(true);
			const data = await getLinks();
			setLinks(data.data);
			setIsAuthenticated(true);
		} catch (err) {
			console.error(err);
			setIsAuthenticated(false);
			setLinks([]);
		} finally {
			setLoading(false);
		}
	};

	//create a link for user
	const handleCreate = async () => {
		try {
			if (!url.startsWith("http")) {
				showToast("Enter valid URL", "error");
				return;
			}
			setCreating(true);
			await createLink(url, name || null);
			showToast("Link created successfully", "success");

			setUrl("");        // clear input
			setName("");       // clear name input
			await fetchLinks();      // refresh list
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to create link", "error");
		} finally {
			setCreating(false);
		}
	};

	//delete a link
	const handleDelete = async (linkId) => {
		if (!window.confirm("Are you sure you want to delete this link?")) {
			return;
		}

		try {
			await deleteLink(linkId);
			showToast("Link deleted successfully", "success");
			setLinks(links.filter(link => link._id !== linkId));
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to delete link", "error");
		}
	};

	const handleCopyLink = async (shortUrl) => {
		try {
			await navigator.clipboard.writeText(shortUrl);
			showToast("Link copied to clipboard", "success");
		} catch (err) {
			console.error(err);
			showToast("Unable to copy link", "error");
		}
	};

	const handleOpenAnalytics = (linkId) => {
		navigate(`/links/${linkId}/analytics`);
	};
	
	//logout user function
	const handleLogout = async () => {
		try {
			await logoutUser();
			setIsAuthenticated(false);
			setLinks([]);
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to logout", "error");
		}
	};

	useEffect(() => {
		fetchLinks();
	}, []);


	if (!loading && !isAuthenticated) {
		return <LoggedOutState />;
	}

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-7xl mx-auto">
				<DashboardHeader onLogout={handleLogout} />
				<CreateLinkForm
					url={url}
					name={name}
					creating={creating}
					onUrlChange={setUrl}
					onNameChange={setName}
					onCreate={handleCreate}
				/>
				<div className="space-y-4">
					<LinkGrid
						links={links}
						loading={loading}
						onCopyLink={handleCopyLink}
						onOpenAnalytics={handleOpenAnalytics}
						onDeleteLink={handleDelete}
					/>
				</div>
			</div>
		</div>
	);
}
