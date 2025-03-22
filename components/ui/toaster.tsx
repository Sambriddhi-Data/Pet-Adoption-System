"use client"

import { Check, CircleAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="grid gap-1">
            {title && <div className="flex items-center gap-2">
              {variant === "success" && <Check className="h-4 w-4 text-white" />}
              {variant === "destructive" && <CircleAlert className="h-4 w-4 text-white" />}
              <ToastTitle>{title}</ToastTitle>              
              </div>
            }
            {description && (

              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
