import { useState } from "react";

export default function LandingPage({ onGetStarted, onLoginClick }) {



    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 text-gray-800">

            <div className="max-w-6xl mx-auto px-6 py-20">

                {/* ===== HERO SECTION ===== */}
                <div className="text-center mb-20">

                    <h1 className="text-5xl font-bold tracking-tight mb-4">
                        Calm<span className="text-emerald-600">Fit</span>
                    </h1>

                    <h2 className="text-2xl font-semibold text-sky-600 mb-6">
                        Train Hard. Recover Deeper.
                    </h2>

                    <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
                        A simple strength system designed to build muscle and lose fat
                    </p>

                </div>

                {/* ===== CTA CARD (UPDATED) ===== */}
                <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mb-24 border border-gray-100 text-center">

                    <button
                        onClick={onGetStarted}
                        className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg transition"
                    >
                        Get Started
                    </button>

                    {/*<p className="text-sm text-gray-500 mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-emerald-600 font-semibold cursor-pointer"
                            onClick={onLoginClick}
                        >
                            Login
                        </span>
                    </p> */}

                </div>

                {/* ===== BODY + MIND SECTION ===== */}
                <div className="grid md:grid-cols-3 gap-10 mb-24">

                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 text-emerald-600">
                            Build Strength
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Boost strength and muscle growth by consistently increasing weight, frequency
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 text-sky-600">
                            Quick Logging
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Recort at lightning speed, keeping focus on your workout
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 text-emerald-600">
                            Sustainable Results
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            No extreme diets
                            No burnout cycles
                            Consistency over motivation.
                        </p>
                    </div>

                </div>

                {/* ===== WHY CALM SECTION ===== */}
                <div className="max-w-3xl mx-auto text-center">

                    <h3 className="text-3xl font-bold mb-6 text-gray-800">
                        Why Calm?
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4">
                        No complex diets. No workout guesswork. Just train, log, and enjoy the process
                    </p>

                    <p className="text-emerald-600 font-semibold text-lg">
                        CalmFit is a calmer way to get fit
                    </p>

                </div>

            </div>
        </div>
    );
}