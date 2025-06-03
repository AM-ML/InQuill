"use client"

import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Button } from "../ui/button"

// Editor props
interface ArticleEditorProps {
  initialData?: any
  onChange: (data: any) => void
  placeholder?: string
}

// Editor API exposed to parent
export interface ArticleEditorRef {
  save: () => void
}

// Mark as client component with explicit client-only code
const ArticleEditorComponent = forwardRef<ArticleEditorRef, ArticleEditorProps>(
  function ArticleEditorComponent({ initialData, onChange, placeholder = "Start writing your article..." }, ref) {
    // References
    const editorRef = useRef<any>(null)
    const holderRef = useRef<HTMLDivElement>(null)
    const initializedRef = useRef(false)
    const isDestroying = useRef(false)
    const contentCacheRef = useRef(initialData || { blocks: [] })
    const loadingRef = useRef<HTMLDivElement>(null)
    
    // Save content without causing rerenders
    const saveContent = useCallback(() => {
      if (editorRef.current && !isDestroying.current) {
        editorRef.current.save().then((outputData: any) => {
          contentCacheRef.current = outputData;
          onChange(outputData);
        }).catch((error: any) => {
          console.error("Error saving editor content:", error);
        });
      }
    }, [onChange]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      save: saveContent
    }));

    // Initialize editor
    useEffect(() => {
      // Skip server-side rendering
      if (typeof window === 'undefined') return;
      
      // Don't initialize twice
      if (initializedRef.current) return;
      
      // Track initialization state
      initializedRef.current = true;
      
      // Don't run if the holder isn't ready
      if (!holderRef.current) return;
      
      // Async load editor and tools
      const initEditor = async () => {
        try {
          // Dynamically import Editor.js and its tools
          const EditorJS = (await import('@editorjs/editorjs')).default;
          const Header = (await import('@editorjs/header')).default;
          const Paragraph = (await import('@editorjs/paragraph')).default;
          const List = (await import('@editorjs/list')).default;
          const Quote = (await import('@editorjs/quote')).default;
          const Image = (await import('@editorjs/image')).default;
          const LinkTool = (await import('@editorjs/link')).default;
          const Embed = (await import('@editorjs/embed')).default;
          const Delimiter = (await import('@editorjs/delimiter')).default;
          const Code = (await import('@editorjs/code')).default;
          
          // Ensure holder still exists after async imports
          if (!holderRef.current) return;
          
          // Ensure consistent data format
          const initData = initialData || { 
            time: new Date().getTime(),
            blocks: [
              {
                id: "initial-block",
                type: "paragraph",
                data: { text: "" }
              }
            ]
          };

          // Create editor with proper config
          const editor = new EditorJS({
            holder: holderRef.current,
            tools: {
              header: {
                class: Header,
                inlineToolbar: true,
                config: {
                  levels: [1, 2, 3],
                  defaultLevel: 2
                }
              },
              paragraph: {
                class: Paragraph,
                inlineToolbar: true
              },
              list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                }
              },
              quote: {
                class: Quote,
                inlineToolbar: true
              },
              image: {
                class: Image,
                config: {
                  uploader: {
                    uploadByFile(file: File) {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                          resolve({
                            success: 1,
                            file: {
                              url: event.target?.result
                            }
                          });
                        };
                        reader.readAsDataURL(file);
                      });
                    }
                  }
                }
              },
              linkTool: LinkTool,
              embed: {
                class: Embed,
                config: {
                  services: {
                    youtube: true,
                    vimeo: true
                  }
                }
              },
              delimiter: Delimiter,
              code: Code
            },
            data: initData,
            autofocus: false,
            placeholder,
            onReady: () => {
              // Store editor reference
              editorRef.current = editor;
              
              // Hide the loading indicator
              if (loadingRef.current) {
                loadingRef.current.style.display = 'none';
              }
              
              // Setup auto-save
              const saveInterval = setInterval(() => {
                if (editor && !isDestroying.current) {
                  editor.save().then((data: any) => {
                    contentCacheRef.current = data;
                  }).catch((err: any) => {
                    console.error("Auto-save failed:", err);
                  });
                } else {
                  clearInterval(saveInterval);
                }
              }, 5000);
              
              // Store interval for cleanup
              return () => clearInterval(saveInterval);
            },
            onChange: async () => {
              try {
                // Only update content reference, don't cause re-renders
                if (editorRef.current && !isDestroying.current) {
                  const data = await editorRef.current.save();
                  contentCacheRef.current = data;
                }
              } catch (err) {
                console.error("Change handler failed:", err);
              }
            }
          });
        } catch (error) {
          console.error("Editor initialization failed:", error);
          if (loadingRef.current) {
            loadingRef.current.innerHTML = 
              '<div class="text-red-500">Failed to load editor. Please refresh the page.</div>';
          }
        }
      };
      
      // Initialize editor
      initEditor();
      
      // Cleanup on unmount
      return () => {
        // Mark as destroying to prevent callbacks during cleanup
        isDestroying.current = true;
        
        // Final save before destruction
        if (editorRef.current) {
          editorRef.current.save()
            .then((outputData: any) => {
              onChange(outputData);
            })
            .catch(() => {})
            .finally(() => {
              // Clean up editor
              if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
              }
            });
        }
        
        // Reset flags
        initializedRef.current = false;
      };
    }, [initialData, onChange, placeholder]);

    return (
      <div className="article-editor w-full">
        <div className="editor-container border rounded-lg overflow-hidden bg-background">
          <div 
            ref={loadingRef} 
            className="h-60 w-full flex items-center justify-center"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div ref={holderRef} className="prose prose-lg dark:prose-invert max-w-none editor-js-content" />
        </div>
      </div>
    )
  }
);

// Export the forwarded ref component
export const ArticleEditor = ArticleEditorComponent;

// To be used in places where you want to render saved content
export function ArticleRenderer({ data }: { data: any }) {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className="text-muted-foreground">No content to display</div>
  }

  return (
    <div className="article-content prose prose-lg dark:prose-invert max-w-none">
      {data.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'header':
            const level = block.data.level || 2
            switch (level) {
              case 1:
                return <h1 key={index} className="mt-6 mb-4 font-bold text-foreground">{block.data.text}</h1>
              case 2:
                return <h2 key={index} className="mt-6 mb-4 font-bold text-foreground">{block.data.text}</h2>
              case 3:
                return <h3 key={index} className="mt-6 mb-4 font-bold text-foreground">{block.data.text}</h3>
              default:
                return <h2 key={index} className="mt-6 mb-4 font-bold text-foreground">{block.data.text}</h2>
            }
          
          case 'paragraph':
            return <p key={index} className="my-4 text-foreground">{block.data.text}</p>
          
          case 'list':
            if (block.data.style === 'ordered') {
              return (
                <ol key={index} className="list-decimal pl-6 my-4">
                  {block.data.items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              )
            }
            return (
              <ul key={index} className="list-disc pl-6 my-4">
                {block.data.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6">
                <p>{block.data.text}</p>
                {block.data.caption && <cite>— {block.data.caption}</cite>}
              </blockquote>
            )
          
          case 'image':
            return (
              <figure key={index} className="my-6">
                <img src={block.data.file?.url} alt={block.data.caption || ''} className="rounded-lg max-w-full" />
                {block.data.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</figcaption>}
              </figure>
            )
          
          case 'delimiter':
            return <hr key={index} className="my-8 border-t border-border" />
          
          case 'embed':
            return (
              <div key={index} className="embed-container my-6">
                <iframe
                  src={block.data.embed}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full aspect-video rounded-lg"
                />
                {block.data.caption && <p className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</p>}
              </div>
            )
          
          case 'code':
            return (
              <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                <code className="text-sm">{block.data.code}</code>
              </pre>
            )
          
          default:
            return null
        }
      })}
    </div>
  )
} 