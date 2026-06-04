"use client";

import { useSignup } from "@/hooks/auth/useSignup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const { mutate, isPending, error } = useSignup();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-orange-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
          Create Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm">
              {(error as any)?.response?.data?.message ||
                "Signup failed. Try again."}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-orange-600 text-white rounded-md disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}