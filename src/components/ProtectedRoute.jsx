import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../utils/auth";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        async function verify() {
            const auth = await checkAuth();
            setIsAuth(auth);
            setLoading(false);
        }
        verify();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!isAuth) return <Navigate to="/login" />;

    return children;
}