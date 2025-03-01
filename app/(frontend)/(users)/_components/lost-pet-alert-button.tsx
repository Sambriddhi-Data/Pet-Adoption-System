import { useState } from "react";
import { Button } from "@/components/ui/button";
import LostPetForm from "./forms/lost-pet-form";

export default function LostPetAlertButton() {
  const [open, setOpen] = useState(false); 

  return (
    <>
      {/* Button that triggers the form */}
      <Button className="absolute top-6 right-4 text-sm" onClick={() => setOpen(true)}>
        Request Lost Pet Alert
      </Button>

      {/* Pass down `open` and `setOpen` to LostPetForm */}
      <LostPetForm open={open} setOpen={setOpen} />
    </>
  );
}
