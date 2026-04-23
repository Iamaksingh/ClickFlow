import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLinks, createLink, logoutUser, deleteLink } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
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
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [linkToDelete, setLinkToDelete] = useState(null);
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
			if (err?.status === 401) {
				setIsAuthenticated(false);
				setLinks([]);
				return;
			}
			showToast(err.message || "Unable to fetch links", "error");
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

	//open delete modal
	const handleDelete = (linkId) => {
		setLinkToDelete(linkId);
		setDeleteModalOpen(true);
	};

	//confirm delete action
	const handleConfirmDelete = async () => {
		if (!linkToDelete) return;

		try {
			await deleteLink(linkToDelete);
			showToast("Link deleted successfully", "success");
			setLinks(links.filter(link => link._id !== linkToDelete));
			setDeleteModalOpen(false);
			setLinkToDelete(null);
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to delete link", "error");
			setDeleteModalOpen(false);
			setLinkToDelete(null);
		}
	};

	//cancel delete action
	const handleCancelDelete = () => {
		setDeleteModalOpen(false);
		setLinkToDelete(null);
	};

	const handleCopyLink = async (link) => {
		try {
			const baseUrl = (import.meta.env.VITE_BASE_URL || window.location.origin).replace(/\/$/, "");
			const shortUrl = link?.shortUrl || `${baseUrl}/${link.shortCode}`;
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

			<ConfirmationModal
				isOpen={deleteModalOpen}
				title="Delete Link"
				message="Are you sure you want to delete this link? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				isDangerous={true}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</div>
	);
}
