/* eslint-disable react/prop-types */
import { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthModal = ({ mode = 'login', onClose, onSwitch, onAuthSuccess }) => {
  const isLogin = mode === 'login';
  // Added form states for MongoDB auth
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Added submit handlers for backend auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onAuthSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: signupEmail, password: signupPassword, campus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      onAuthSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Send the ID token to our backend to authenticate
      const res = await fetch('http://localhost:5000/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Firebase auth failed');
      onAuthSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm"
            aria-label="Close"
          >
            x
          </button>

          <div className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              CM
            </div>
            <div className="text-lg font-semibold text-slate-900">Campus Marketplace</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 bg-slate-200/70 rounded-xl p-1">
            <button
              type="button"
              onClick={() => onSwitch?.('login')}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                isLogin ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => onSwitch?.('signup')}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                !isLogin ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {isLogin ? (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-600 mt-1">Sign in to your student account</p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="text-sm font-medium text-slate-700">University Email</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <span className="text-slate-400">@</span>
                    <input
                      type="email"
                      placeholder="yourname@university.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <button type="button" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <span className="text-slate-400">lock</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Keep me logged in
                </label>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg disabled:opacity-70"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-500">OR CONTINUE WITH</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-70"
                  >
                    Google
                  </button>
                  <button type="button" className="rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium shadow-sm">
                    Apple
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  By signing up, you agree to our <span className="text-blue-600">Terms</span> &{' '}
                  <span className="text-blue-600">Privacy Policy</span>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Join the Community</h2>
                <p className="text-slate-600 mt-1">Verify your campus identity to start trading</p>
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-sm text-blue-700">
                Student Email Required
                <div className="text-xs text-blue-600/90">
                  Only official .edu or university domains are accepted.
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700">University Email</label>
                <input
                  type="email"
                  placeholder="yourname@university.edu"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none"
                />
              </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-700">Select Campus</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none"
                >
                  <option>Choose your university...</option>
                  <option>State University</option>
                  <option>City College</option>
                  <option>Tech Institute</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none"
                />
              </div>

              {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 shadow-lg disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-500">OR CONTINUE WITH</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-70"
                >
                  Google
                </button>
                <button type="button" className="rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium shadow-sm">
                  Apple
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500 text-center">
                By signing up, you agree to our <span className="text-blue-600">Terms</span> &{' '}
                <span className="text-blue-600">Privacy Policy</span>
              </p>
            </>
          )}
        </div>

        {/* Footer badges */}
        <div className="bg-white/70 px-6 py-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-slate-500 font-semibold tracking-wide">
            <div>VERIFIED USERS</div>
            <div>SECURE TRADE</div>
            <div>CAMPUS ONLY</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
