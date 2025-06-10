"use client"

import { useState, useEffect } from "react"
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image } from "lucide-react"
import { Button } from "./button"
import { Separator } from "./separator"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is only rendered on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="border rounded-md p-4 min-h-[400px] bg-muted/20">
        Loading editor...
      </div>
    )
  }

  const handleExecCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value)
    
    // Get updated content and call onChange
    const editorContent = document.getElementById("newsletter-editor")?.innerHTML
    if (editorContent !== undefined) {
      onChange(editorContent)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div className="bg-muted/20 p-2 border-b flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("bold")}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("italic")}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("underline")}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("insertOrderedList")}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("justifyLeft")}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("justifyCenter")}
          className="h-8 w-8 p-0"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExecCommand("justifyRight")}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter link URL:")
            if (url) handleExecCommand("createLink", url)
          }}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter image URL:")
            if (url) handleExecCommand("insertImage", url)
          }}
          className="h-8 w-8 p-0"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        id="newsletter-editor"
        className="p-4 min-h-[400px] outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        placeholder={placeholder}
        style={{ minHeight: "400px" }}
      />
    </div>
  )
} 