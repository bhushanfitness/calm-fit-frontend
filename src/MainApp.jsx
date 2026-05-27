import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config/api";

axios.defaults.withCredentials = true;

const API_URL = API_BASE_URL;

export default function MainApp({ goToLogin, goToLanding }) {

    const [selectedDay, setSelectedDay] = useState(1);
    const [routineData, setRoutineData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState("");

    const [meditating, setMeditating] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [userEmail, setUserEmail] = useState("");

    const [completedDays, setCompletedDays] = useState(() => {
        const saved = localStorage.getItem("completedDays");
        return saved ? JSON.parse(saved) : {};
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem("streak");
        return saved ? parseInt(saved) : 0;
    });

    const [mindStreak, setMindStreak] = useState(() => {
        const saved = localStorage.getItem("mindStreak");
        return saved ? parseInt(saved) : 0;
    });



    // 🔐 AUTH CHECK (NEW)
    // useEffect(() => {
    //     axios.get(`${API_URL}/api/auth/me`)
    //         .catch(() => {
    //             console.log("Auth check failed");
    //         });
    // }, []);

    // 🔧 FIXED (removed userId)
    const fetchRoutine = async (day) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_URL}/api/routine/day/${day}`
            );
            setRoutineData(res.data);
        } catch {
            alert("Failed to load routine data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutine(selectedDay);
    }, [selectedDay]);

    useEffect(() => {
        let timer;

        if (meditating && secondsLeft > 0) {
            timer = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        }

        if (secondsLeft === 0 && meditating) {
            setMeditating(false);
            const newStreak = mindStreak + 1;
            setMindStreak(newStreak);
            localStorage.setItem("mindStreak", newStreak.toString());
            setSecondsLeft(300);
        }

        return () => clearInterval(timer);
    }, [meditating, secondsLeft]);

    const openLogModal = (exercise) => {
        setSelectedExercise(exercise);
        setReps(8);
        setWeight("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedExercise(null);
    };

    const saveLog = async () => {

        if (!selectedExercise || !weight || isNaN(weight)) {
            alert("Enter valid weight");
            return;
        }

        // check login first
        try {

            const auth = await axios.get(
                `${API_URL}/api/auth/me`,
                { withCredentials: true }
            );

            if (auth.data === "anonymousUser") {
                closeModal();
                goToLogin();
                return;
            }

        } catch {
            closeModal();      // current log popup close
            goToLogin();       // open login screen
            return;
        }

        // actual save
        try {

            await axios.post(
                `${API_URL}/api/workout/log`,
                {
                    exerciseId: selectedExercise.exerciseId,
                    weight: parseFloat(weight),
                    reps
                }
            );

            closeModal();
            fetchRoutine(selectedDay);

        } catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Full:", err);

            alert("Failed to save log");
        }
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/workout/strength`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.hasEnoughData) {
                    setStrength(data.totalGain);
                } else {
                    setStrength("Start logging workouts");
                }
            });
    }, []);

    const completedCount = Object.keys(completedDays).length;
    const progressPercent = (completedCount / 5) * 100;

    const totalGain =
        routineData?.exercises?.reduce(
            (acc, ex) => acc + (ex.strengthGainPercent || 0),
            0
        ) || 0;

    const formatTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // 🔓 LOGOUT (NEW)

    const logout = async () => {
        console.log("1: Logout clicked");

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            console.log("3: API success", response);

        } catch (err) {
            console.log("4: API failed");
            console.log(err);
            console.log(err.response);
        }

        localStorage.removeItem("token");

        goToLanding();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-800">

            {/* HEADER */}
            <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        Calm<span className="text-emerald-600">Fit</span>
                    </h1>

                    <div className="text-right">
                        <p className="text-sm text-slate-500">Welcome</p>

                        {/* ❌ REMOVED TEST LOGIN */}

                        {/* ✅ LOGOUT BUTTON */}
                        <button
                            onClick={logout}
                            className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Logout
                        </button>

                        <p className="font-semibold">{userEmail}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* MIND SESSION CARD */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6 mb-8 flex justify-between items-center">

                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            🧘 Mind Session
                        </h3>

                        <p className="text-slate-500 text-sm">
                            5 min guided breathing
                        </p>

                        <p className="text-sm text-emerald-600 mt-1">
                            Mind Streak: {mindStreak} Day{mindStreak !== 1 && "s"}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600 mb-3">
                            {formatTime(secondsLeft)}
                        </p>

                        <button
                            onClick={() => setMeditating(!meditating)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${meditating
                                ? "bg-red-500 text-white"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                        >
                            {meditating ? "Stop" : "Start"}
                        </button>
                    </div>

                </div>

                {/* SMART EATS CARD */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6 mb-8">

                    <div className="flex flex-col md:flex-row justify-between gap-8 items-start">

                        {/* LEFT SIDE — CORE MESSAGE */}
                        <div className="flex-1">

                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                🥗 Smart Eats
                            </h3>

                            <p className="text-slate-900 text-base font-semibold mb-2">
                                Add protein to every meal.
                            </p>

                            <p className="text-slate-600 text-sm mb-4">
                                Most Indian meals are carb-heavy.
                                Just add paneer, yogurt, eggs, legumes, or whey.
                            </p>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 space-y-1">
                                <p>• Eat at least one fruit daily for fiber</p>
                                <p>• Protein + fiber naturally control hunger</p>
                                <p>• Eat mindfully. No calorie obsession.</p>
                            </div>

                        </div>

                        {/* RIGHT SIDE — CTA */}
                        <div className="w-full md:w-52 border border-emerald-200 rounded-xl p-4 bg-white text-center shadow-sm">

                            <p className="text-sm font-semibold text-slate-800 mb-3">
                                Explore Meal Ideas
                            </p>

                            <a
                                href="https://www.instagram.com/sudhanshu.bhushan_"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Open Smart Eats →
                            </a>

                            <p className="text-xs text-slate-500 mt-3">
                                Practical Indian meals
                            </p>

                        </div>

                    </div>

                </div>

                {/* DAY SELECTOR */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[1, 2, 3, 4, 5].map((d) => (
                        <button
                            key={d}
                            onClick={() => setSelectedDay(d)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${selectedDay === d
                                ? "bg-emerald-600 text-white"
                                : "bg-white border border-emerald-100 text-slate-600 hover:bg-emerald-50"
                                }`}
                        >
                            Day {d} {completedDays[d] && "✔"}
                        </button>
                    ))}
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-emerald-50 text-slate-600 text-sm">
                            <tr>
                                <th className="px-6 py-4">Exercise</th>
                                <th className="px-6 py-4">Wt (8)</th>
                                <th className="px-6 py-4">Wt (10)</th>
                                <th className="px-6 py-4">Wt (12)</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                routineData?.exercises?.map((ex) => (
                                    <tr
                                        key={ex.exerciseId}
                                        className="border-t border-emerald-100 hover:bg-emerald-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{ex.name}</div>
                                            <div className="text-xs text-slate-500">
                                                {ex.muscleGroup}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">{ex.wt8 ?? "-"}</td>
                                        <td className="px-6 py-4">{ex.wt10 ?? "-"}</td>
                                        <td className="px-6 py-4">{ex.wt12 ?? "-"}</td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openLogModal(ex)}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                                            >
                                                Log
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* STRENGTH CARD */}
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 mt-10 shadow-sm">
                    <div>
                        <h3 className="text-lg font-semibold">Your Strength Growth</h3>
                    </div>

                    <p className="text-3xl font-bold text-emerald-600">
                        {totalGain.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* LOG MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            Log {selectedExercise?.name}
                        </h3>

                        <div className="mb-3">
                            <label className="text-sm">Reps</label>
                            <input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(parseInt(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm">Weight</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveLog}
                                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}