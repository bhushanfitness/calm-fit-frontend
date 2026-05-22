import { useState } from "react";

export default function Login({ initialMode = "login" }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSignup, setIsSignup] = useState(
        initialMode === "signup"
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isSignup
            ? "http://localhost:8080/api/auth/signup"
            : "http://localhost:8080/api/auth/login";

        try {
            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (res.ok) {

                // signup case
                if (isSignup) {
                    alert("Account created successfully");

                    setIsSignup(false); // switch back to login
                    setPassword("");    // clear password

                    return;             // IMPORTANT
                }

                // login case only
                window.location.reload();

            } else {

                const text = await res.text();
                alert("Login failed: " + text);
            }

        } catch (err) {
            console.error(err);
            alert("Server connection failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 via-white to-green-50">

            <div className="bg-white w-96 p-8 rounded-2xl shadow-lg border border-gray-100">

                <h2 className="text-2xl font-bold text-center mb-6">
                    {isSignup ? "Sign Up" : "Login"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
                    >
                        {isSignup ? "Create Account" : "Login"}
                    </button>

                </form>

                <p
                    className="text-center text-sm mt-5 text-emerald-600 cursor-pointer"
                    onClick={() => setIsSignup(!isSignup)}
                >
                    {isSignup
                        ? "Already have an account? Login"
                        : "Create account"}
                </p>

            </div>

        </div>
    );
}