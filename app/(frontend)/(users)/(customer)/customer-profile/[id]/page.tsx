'use client';

import { Card, CardHeader } from "@/components/ui/card";
import { useSession } from "@/auth-client";
import { useState } from "react";
import classNames from "classnames";
import AdoptPetForm from "../../../_components/forms/apply-to-adopt-form";

export default function CustomerProfile() {
  // State to track active section
  const [activeSection, setActiveSection] = useState<"editProfile" | "myProfile" | "myFavorites" | null>(null);

  return (
    <div className='m-10'>
      <Card>
        <CardHeader className="text-2xl">My Adopter Account</CardHeader>
        <div
          className={classNames({
            "p-6 pt-0 grid grid-cols-3 space-x-4 text-xl": true,
          })}>
          <div
            className={`cursor-pointer p-2 rounded ${activeSection === "editProfile" ? "text-coral" : "hover:underline"
              }`}
            onClick={() => setActiveSection("editProfile")}>
            Edit Profile
          </div>
          <div
            className={`cursor-pointer p-2 rounded ${activeSection === "myProfile" ? "text-coral" : "hover:underline"
              }`}
            onClick={() => setActiveSection("myProfile")}>
            My Profile
          </div>
          <div
            className={`cursor-pointer p-2 rounded ${activeSection === "myFavorites" ? "text-coral" : "hover:underline"
              }`}
            onClick={() => setActiveSection("myFavorites")}>
            My Favorites
          </div>
        </div>
      </Card>

      {/* Render the active section */}
      {activeSection === "editProfile" && <AdoptPetForm />}
      {activeSection === "myProfile" && <p>My Profile Content</p>}
      {activeSection === "myFavorites" && <p>My Favorites Content</p>}

      {/* Button to close the section */}
      {activeSection && (
        <button
          onClick={() => setActiveSection(null)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      )}
    </div>
  );
}
