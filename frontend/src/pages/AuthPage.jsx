import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaBrain,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import API from "../api/axios"; // 🔥 add this

const AuthPage = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  // 🔥 Added state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Added handler
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        const res = await API.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("access_token", res.data.access_token);
        onLoginSuccess();
      } else {
        await API.post("/auth/register", {
          full_name: fullName,
          email,
          password,
        });

        alert("Registration successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black text-white font-sans">

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 1, -1, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/20 mix-blend-overlay" />
      </motion.div>

      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-50 btn btn-circle btn-ghost text-white hover:bg-white/10 group"
      >
        <FaArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="relative z-10 w-full max-w-md p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
            transition={{ duration: 0.3 }}
            className="card w-full shadow-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8"
          >
            <div className="text-center mb-8">
              <FaBrain className="text-5xl text-primary mx-auto mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Join AlgoSelector"}
              </h2>
              <p className="text-white/60 text-sm">
                {isLogin
                  ? "Access your AutoML dashboard"
                  : "Start your meta-learning journey"}
              </p>
            </div>

            <div className="flex flex-col gap-4">

              {!isLogin && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/80 font-semibold">
                      Full Name
                    </span>
                  </label>
                  <label className="input input-bordered bg-white/5 border-white/10 text-white focus-within:border-primary flex items-center gap-2">
                    <FaUser className="text-white/50" />
                    <input
                      type="text"
                      className="grow placeholder:text-white/30"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80 font-semibold">
                    Email
                  </span>
                </label>
                <label className="input input-bordered bg-white/5 border-white/10 text-white focus-within:border-primary flex items-center gap-2">
                  <FaEnvelope className="text-white/50" />
                  <input
                    type="email"
                    className="grow placeholder:text-white/30"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80 font-semibold">
                    Password
                  </span>
                </label>
                <label className="input input-bordered bg-white/5 border-white/10 text-white focus-within:border-primary flex items-center gap-2">
                  <FaLock className="text-white/50" />
                  <input
                    type="password"
                    className="grow placeholder:text-white/30"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary btn-block text-white font-bold text-lg mt-4 shadow-lg shadow-primary/20"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/40 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <button
                className="flex items-center justify-center gap-3 w-full bg-white text-gray-700 font-medium py-3 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Continue with Google
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="link link-primary font-bold no-underline hover:underline ml-1"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
