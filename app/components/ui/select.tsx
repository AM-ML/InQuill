import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  children: React.ReactNode
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const Select = ({
  children,
  value,
  onValueChange,
  className,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("relative w-full", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setOpen(!open),
            value,
          })
        }
        if (
          React.isValidElement(child) &&
          child.type === SelectContent &&
          open
        ) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onValueChange,
            onClose: () => setOpen(false),
          })
        }
        return null
      })}
    </div>
  )
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  value?: string
}

const SelectTrigger = ({
  children,
  className,
  onClick,
  value,
}: SelectTriggerProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <span className="text-sm">{placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
  onValueChange?: (value: string) => void
  onClose?: () => void
}

const SelectContent = ({
  children,
  className,
  onValueChange,
  onClose,
}: SelectContentProps) => {
  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
    >
      <div className="p-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onSelect: (value: string) => {
                onValueChange?.(value)
                onClose?.()
              },
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

interface SelectItemProps {
  children: React.ReactNode
  className?: string
  value: string
  onSelect?: (value: string) => void
}

const SelectItem = ({
  children,
  className,
  value,
  onSelect,
}: SelectItemProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={() => onSelect?.(value)}
    >
      <span>{children}</span>
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } 