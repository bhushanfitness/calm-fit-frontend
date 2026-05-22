export default function WelcomeScreen({ userName, onStart }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 flex items-center justify-center px-6">

            <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl shadow-xl p-12 w-full max-w-md text-center">

                <p className="text-sm text-slate-500 mb-2">
                    Welcome
                </p>

                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                    {userName}
                </h1>

                {/* Brand Tagline */}
                <p className="text-emerald-600 font-semibold mb-6 tracking-wide">
                    Train Hard. Recover Deeper.
                </p>

                <button
                    onClick={onStart}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
                >
                    Start Day 1
                </button>

            </div>
        </div>
    );
}


