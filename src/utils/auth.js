import { API_BASE_URL } from "./config/api";

export async function checkAuth() {
    const res = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
            credentials: "include",
        }
    );

    return res.ok;
}