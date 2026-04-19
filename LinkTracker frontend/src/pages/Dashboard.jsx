import { useEffect, useState } from "react";
import { getLinks } from "../services/api.js";

const baseUrl = "http://localhost:5000";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	
	useEffect(() => {
		const fetchLinks = async () => {
			try {
				const data = await getLinks();
				setLinks(data.data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchLinks();
	}, []);

	return (
		<div>
			<h2>Dashboard</h2>

			{links.length === 0 ? ( <p>No links yet</p> ) : (
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