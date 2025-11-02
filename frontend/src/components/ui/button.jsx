import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const baseClass = "btn"
  const variantClass = variant === "outline" ? "btn-secondary" : 
                      variant === "ghost" ? "btn-ghost" : "btn-primary"
  const sizeClass = size === "sm" ? "btn-sm" : ""
  
  return (
    <button
      className={cn(baseClass, variantClass, sizeClass, className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }