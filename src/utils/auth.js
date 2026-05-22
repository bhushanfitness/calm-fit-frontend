export async function checkAuth() {
    const res = await fetch("https://calm-fit-backend.onrender.com/api/auth/me", {
        credentials: "include",
    });

    return res.ok;
}