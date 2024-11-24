import { useState, useCallback } from 'react'

type ToastProps = {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, { title, description, variant }])
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1))
    }, 5000)
  }, [])

  return { toast, toasts }
}

