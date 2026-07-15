import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5C3317] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] shadow-lg shadow-[#5C3317]/20 hover:shadow-xl hover:shadow-[#5C3317]/30 hover:from-[#7A4320] hover:to-[#5C3317] hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5",
        outline:
          "border border-[rgba(255,218,185,0.2)] bg-[rgba(255,255,255,0.05)] backdrop-blur-xl text-[#FFDAB9] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,218,185,0.3)] hover:-translate-y-0.5",
        secondary:
          "bg-[rgba(255,255,255,0.08)] text-white border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.15)]",
        ghost:
          "hover:bg-[rgba(255,255,255,0.08)] hover:text-[#FFDAB9] text-[rgba(255,255,255,0.7)]",
        link: "text-[#FFDAB9] underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] text-[#09090B] shadow-xl shadow-[#5C3317]/30 hover:shadow-2xl hover:shadow-[#5C3317]/40 hover:-translate-y-1 font-bold",
        glass:
          "bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] shadow-md",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-5 text-base",
        xl: "h-14 rounded-2xl px-10 has-[>svg]:px-6 text-lg font-bold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
