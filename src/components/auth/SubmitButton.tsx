'use client'
// src/components/auth/SubmitButton.tsx
// Gives the login/signup forms visible pending feedback so a slow first
// request (dev-mode compile, cold network) doesn't look like a dead button.

import { useFormStatus } from 'react-dom'

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
