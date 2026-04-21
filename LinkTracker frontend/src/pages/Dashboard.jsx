import { useEffect, useState } from "react";
import { getLinks, createLink } from "../services/api.js";

const baseUrl = "http://localhost:5000";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	const [url, setUrl] = useState("");

	//fetch all user links
	const fetchLinks = async () => {
		try {
			const data = await getLinks();
			setLinks(data.data);
		} catch (err) {
			console.error(err);
		}
	};

	//create a link for user
	const handleCreate = async () => {
		try {
			if (!url.startsWith("http")) {
				alert("Enter valid URL");
				return;
			}

			await createLink(url);

			setUrl("");        // clear input
			fetchLinks();      // 🔥 refresh list
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	useEffect(() => {
		fetchLinks();
	}, []);

	return (
		<div>
			<h2>Dashboard</h2>
			<div>
				<input
					type="text"
					placeholder="Enter URL"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>

				<button onClick={handleCreate}>
					Create Link
				</button>
			</div>
			{links.length === 0 ? (<p>No links yet</p>) : (
				links.map((link) => (
					<div key={link._id}>
						<p><strong>{link.shortCode}</strong></p>
						<p>{link.originalUrl}</p>
					</div>
				))
			)}
		</div>
	);
}