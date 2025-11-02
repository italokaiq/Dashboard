import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null
  
  return (
    <div className="modal-overlay">
      {children}
    </div>
  )
}

const DialogContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("modal-content", className)}
    {...props}
  >
    <button className="modal-close" onClick={onClose}>
      <X size={16} />
    </button>
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("modal-header", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("modal-title", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogClose = ({ onClick, children }) => (
  <button className="modal-close" onClick={onClick}>
    {children || <X size={16} />}
  </button>
)

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
}