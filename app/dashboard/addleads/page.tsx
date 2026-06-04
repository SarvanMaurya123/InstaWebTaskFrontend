"use client";

import CreateLeads from "@/components/leads/createLeads";

export default function AddLeadsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add New Lead</h1>
            <CreateLeads />
        </div>
    );
}