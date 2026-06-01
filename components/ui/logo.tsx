import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 32, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-boba drop-shadow-sm", className)}
      {...props}
    >
      {/* Cup outline */}
      <path d="M7 4l-1 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2L17 4" />
      {/* Lid */}
      <path d="M5 4h14" />
      <path d="M6 2h12" />
      {/* Straw */}
      <path d="M12 2v-1l4-1" strokeWidth="1.5" />
      {/* Boba pearls */}
      <circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
