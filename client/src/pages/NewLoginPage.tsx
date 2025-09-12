import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewLoginPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      // Sign Up Logic
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      console.log("Attempting to sign up with:", { fullName, email, password });
      alert("Account created successfully! (This is a demo)");
      // In a real application, you would send this to your backend
    } else {
      // Sign In Logic
      console.log("Attempting to sign in with:", { email, password });
      alert("Signed in successfully! (This is a demo)");
      // In a real application, you would send this to your backend
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-6xl overflow-hidden min-h-[600px] md:h-[800px]">
        <div className="w-full md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/">
                <span className="text-2xl font-bold text-gray-800 cursor-pointer">
                  QuranicArabic
                </span>
              </Link>
            </div>
            <div className="flex border border-gray-200 rounded-lg p-1 mb-8 w-full max-w-xs mx-auto">
              <Button
                id="signup-tab"
                variant="custom"
                className={`${isSignUp ? "bg-green-600 text-white" : "bg-transparent text-gray-500"} py-2 px-6 rounded-md text-sm font-semibold transition-colors flex-1`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </Button>
              <Button
                id="signin-tab"
                variant="custom"
                className={`${!isSignUp ? "bg-green-600 text-white" : "bg-transparent text-gray-500"} py-2 px-6 rounded-md text-sm font-semibold transition-colors hover:text-gray-700 flex-1`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </Button>
            </div>

            {isSignUp ? (
              // Sign Up Form
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="mb-4">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold mt-8 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  type="submit"
                >
                  Create Account
                </Button>
              </form>
            ) : (
              // Sign In Form
              <form onSubmit={handleSubmit} className="signin-form">
                <div className="mb-4">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="signin-password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold mt-8 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  type="submit"
                >
                  Sign In
                </Button>
              </form>
            )}

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-xs text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center flex-wrap gap-3">
              <div>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#4285F4">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </button>
              </div>
              <div>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-12 text-center text-xs text-gray-500">
              By signing up to create an account I accept Company's
              <br />
              <Link href="#" className="font-medium text-gray-900">
                Terms of Use &amp; Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div
          className="hidden md:flex w-1/2 p-12 text-black flex-col justify-center items-center rounded-r-3xl"
          style={{ backgroundColor: "#F5F5DC" }}
        >
          <div className="text-center">
            <h1
              id="main-text"
              className="text-5xl font-bold leading-tight smooth-float"
            >
              {isSignUp ? (
                <>
                  Create your account
                  <br /> and start the learning journey.
                </>
              ) : (
                <>
                  Welcome back!
                  <br /> Sign in to continue your journey.
                </>
              )}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
