'use client';

import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import AdopterProfileForm from "../../../_components/forms/adopter-profile-form";
import { cn } from "@/lib/utils"; // Utility for class merging

export default function CustomerProfile() {
  // State to track active section
  const [activeSection, setActiveSection] = useState<"editProfile" | "myProfile" | "myFavorites">("editProfile");

  return (
    <div className="m-10">
      <Card>
        <CardHeader className="text-2xl">My Adopter Account</CardHeader>

        {/* Navigation Tabs */}
        <div className="flex border-b">
          {["editProfile", "myProfile", "myFavorites"].map((section) => (
            <button
              key={section}
              className={cn(
                "flex-1 py-3 text-xl text-center transition-all",
                activeSection === section ? "border-b-4 border-coral text-coral font-semibold" : "hover:bg-gray-100"
              )}
              onClick={() => setActiveSection(section as any)}
            >
              {section === "editProfile" ? "Edit Profile" : section === "myProfile" ? "My Profile" : "My Favorites"}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {activeSection === "editProfile" && <AdopterProfileForm />}
          {activeSection === "myProfile" && <p>My Profile Content</p>}
          {activeSection === "myFavorites" && <p>My Favorites Content</p>}
        </div>
      </Card>
    </div>
  );
}
