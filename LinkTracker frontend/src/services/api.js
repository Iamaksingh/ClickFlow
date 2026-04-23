//defining th baseURL
const BASE_URL = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

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
        const error = new Error(data.message || "Login failed");
        error.status = res.status;
        throw error;
    }

    return data;
};

// this is the signup API service
export const signupUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || "Signup failed");
        error.status = res.status;
        throw error;
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
        const error = new Error(data.message || "Logout failed");
        error.status = res.status;
        throw error;
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
        const error = new Error(data.message || "Failed to fetch links");
        error.status = res.status;
        throw error;
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
        const error = new Error(data.message || "Failed to create link");
        error.status = res.status;
        throw error;
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
        const error = new Error(data.message || "Failed to delete link");
        error.status = res.status;
        throw error;
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
        const error = new Error(data.message || "Failed to fetch link analytics");
        error.status = res.status;
        throw error;
    }

    return data;
};