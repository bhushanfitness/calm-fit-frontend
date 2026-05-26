export async function checkAuth() {
    const res = await fetch("https://api.calmfit.in/api/auth/me", {
        credentials: "include",
    });

    return res.ok;
}