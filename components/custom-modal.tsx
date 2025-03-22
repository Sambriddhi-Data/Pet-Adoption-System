'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] ${!isOpen ? 'hidden' : ''}`}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto z-[1001]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </div>
        <div className="">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};