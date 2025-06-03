import React, { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '../../lib/utils/cn';

interface TipTapRendererProps {
  content: string | { type: string; content: any[] };
  className?: string;
}

const TipTapRenderer = ({ content, className }: TipTapRendererProps) => {
  // Create a non-editable editor instance for rendering
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-700 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight
    ],
    content: processContent(content),
    editable: false,
  });

  // Process the content to ensure it's in the correct format
  function processContent(content: string | { type: string; content: any[] }) {
    if (!content) return '';
    
    if (typeof content === 'string') {
      if (content.trim() === '') return '';
      // If it's already HTML or plain text, return as is
      return content;
    }
    
    // If it's JSON object, return as is
    return content;
  }

  return (
    <div className={cn('tiptap-renderer', className)}>
      {editor ? (
        <EditorContent 
          editor={editor} 
          className="prose prose-lg dark:prose-invert max-w-none overflow-hidden"
        />
      ) : (
        <div className="flex items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default TipTapRenderer; 