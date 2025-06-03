import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '../ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { apiClient } from '../../lib/utils/apiClient';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils/cn';

// Editor props
export interface TipTapEditorProps {
  initialContent?: string | { type: string; content: any[] };
  onChange?: (content: { type: string; content: any[] }) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

// Editor ref API
export interface TipTapEditorRef {
  getJSON: () => any;
  getHTML: () => string;
  clearContent: () => void;
  focus: () => void;
}

// Define color options
const colors = [
  { name: 'Default', value: 'inherit' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#666666' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Orange', value: '#FFA500' },
];

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  function TipTapEditor({ initialContent, onChange, placeholder = 'Start writing...', editable = true, className }, ref) {
    const { toast } = useToast();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
    const [linkUrl, setLinkUrl] = useState<string>('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Initialize the editor
    const editor = useEditor({
      extensions: [
        StarterKit,
        Image,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 underline'
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right'],
        }),
        TextStyle,
        Color,
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'is-editor-empty',
        }),
        Heading.configure({
          levels: [1, 2, 3],
        }),
        Underline,
        Highlight.configure({
          multicolor: true
        }),
      ],
      content: getInitialContent(),
      editable,
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange({
            type: 'doc',
            content: editor.getJSON().content
          });
        }
      },
    });

    // Function to process initial content
    function getInitialContent() {
      if (!initialContent) return '';
      
      if (typeof initialContent === 'string') {
        return initialContent;
      }
      
      // Handle JSON content
      return initialContent;
    }

    // Expose editor methods via the ref
    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML() || '',
      clearContent: () => editor?.commands.clearContent(),
      focus: () => editor?.commands.focus(),
    }));

    // Handle image upload
    const handleImageUpload = async (file: File) => {
      try {
        setImageUploadLoading(true);
        const response = await apiClient.uploads.articleImage(file);
        
        if (editor) {
          editor.chain().focus().setImage({ src: response.file.url }).run();
        }
        
        toast({
          title: "Image uploaded",
          description: "Your image was uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setImageUploadLoading(false);
      }
    };

    const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };

    // Insert image via URL
    const handleInsertImageUrl = () => {
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
        setImageUrl('');
      }
    };

    // Handle adding a link
    const handleInsertLink = () => {
      if (linkUrl && editor) {
        editor.chain().focus().extendMarkRange('link')
          .setLink({ href: linkUrl })
          .run();
        setLinkUrl('');
      }
    };

    // Only render editor once it's initialized
    if (!editor) {
      return <div className="h-60 w-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }

    return (
      <div className={cn('tiptap-editor border rounded-lg overflow-hidden', className)}>
        {editable && (
          <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-900 items-center">
            {/* Undo/Redo */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

            {/* Headings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Heading1 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Text styling */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            
            {/* Lists */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            {/* Blockquote and Code */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Code className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            
            {/* Alignment */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <AlignRight className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            
            {/* Text color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="grid grid-cols-4 gap-1">
                    {colors.map((color) => (
                      <Button
                        key={color.value}
                        variant="outline"
                        className="w-full h-8 p-0"
                        style={{ backgroundColor: color.value }}
                        onClick={() => editor.chain().focus().setColor(color.value).run()}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Highlighter */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            
            {/* Link */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="link-url">Link URL</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="link-url" 
                      value={linkUrl} 
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                    <Button onClick={handleInsertLink}>Add</Button>
                  </div>
                  {editor.isActive('link') && (
                    <Button 
                      variant="outline"
                      onClick={() => editor.chain().focus().unsetLink().run()}
                    >
                      Remove Link
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Image upload */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="flex">
                      <input 
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageInputChange}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => imageInputRef.current?.click()} 
                        disabled={imageUploadLoading}
                      >
                        {imageUploadLoading ? 'Uploading...' : 'Choose File'}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Or insert URL</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="image-url" 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button onClick={handleInsertImageUrl}>Add</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        {/* Bubble menu for quick formatting on selection */}
        {editable && editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150 }}
            className="bg-white dark:bg-gray-800 p-1 shadow-lg border rounded-lg flex space-x-1"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
          </BubbleMenu>
        )}
        
        {/* Main editor content */}
        <EditorContent 
          editor={editor} 
          className={cn(
            'prose prose-lg dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none',
            !editable && 'pointer-events-none'
          )}
        />
      </div>
    );
  }
);

export default TipTapEditor; 