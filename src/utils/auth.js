export async function checkAuth() {
    const res = await fetch("http://localhost:8080/api/auth/me", {
        credentials: "include",
    });

    return res.ok;
}