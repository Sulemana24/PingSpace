import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (!email || !email.includes("@") || email.length < 6) {
        setError("Please enter a valid email address.");
      } else if (email === "notfound@example.com") {
        setError("Email address not found.");
      } else {
        setSubmitted(true);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Forgot Password
        </h2>

        {!submitted ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded transition duration-200 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center text-green-600 dark:text-green-400">
            <p className="mb-4">
              Password reset link sent! Please check your email.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-sm text-red-700 dark:text-red-400 hover:underline"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
