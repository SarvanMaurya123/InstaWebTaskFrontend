"use client";

import { useCreateLead } from "@/hooks/leads/useCreateLead";
import { useState } from "react";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONVERTED"
  | "LOST";

export default function CreateLeads() {
  const { mutate, isPending, error } = useCreateLead();

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    status: "NEW" as LeadStatus,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess(false);

    mutate(form, {
      onSuccess: () => {
        setForm({
          name: "",
          email: "",
          phoneNumber: "",
          companyName: "",
          status: "NEW",
          notes: "",
        });

        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      },
    });
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create New Lead</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Lead created successfully 
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <fieldset disabled={isPending} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            placeholder="Name"
            required
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            placeholder="Email"
            required
          />

          {/* Phone */}
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            placeholder="Phone Number"
            required
          />

          {/* Company */}
          <input
            type="text"
            value={form.companyName}
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            placeholder="Company Name"
            required
          />

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as LeadStatus,
              })
            }
            className="w-full border p-2 rounded-md"
          >
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="LOST">LOST</option>
          </select>

          {/* Notes */}
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            placeholder="Notes..."
            rows={4}
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm">
              {(error as any)?.response?.data?.message ||
                "Something went wrong"}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Lead"}
          </button>

        </fieldset>
      </form>
    </div>
  );
}