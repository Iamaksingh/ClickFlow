const BASE_URL = "http://localhost:5000";


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


//this is api to get all user links 
export const getLinks = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/links`, {
            credentials: "include", // must
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
};


//this is the api to create a new Link
export const createLink = async (originalUrl) => {
    const res = await fetch(`${BASE_URL}/api/links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // cookie auth
        body: JSON.stringify({ originalUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to create link");
    }

    return data;
};