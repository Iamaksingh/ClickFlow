//defining th baseURL
const BASE_URL = import.meta.env.BASE_URL;

//this is the login API service
export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};

//this is the logout API
export const logoutUser = async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Logout failed");
    }

    return data;
};

//this is api to get all user links 
export const getLinks = async () => {
    const res = await fetch(`${BASE_URL}/api/links`, {
        credentials: "include", // must
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch links");
    }

    return data;
};

//this is the api to create a new Link
export const createLink = async (originalUrl, name) => {
    const res = await fetch(`${BASE_URL}/api/links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // cookie auth
        body: JSON.stringify({ originalUrl, name }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to create link");
    }

    return data;
};

// Delete a API to delete a link 
export const deleteLink = async (linkId) => {
    const res = await fetch(`${BASE_URL}/api/links/${linkId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to delete link");
    }

    return data;
};

// this is api to get analytics for one link
export const getLinkStats = async (linkId) => {
    const res = await fetch(`${BASE_URL}/api/links/${linkId}/stats`, {
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch link analytics");
    }

    return data;
};