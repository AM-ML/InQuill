import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import { apiClient } from '../../lib/utils/apiClient';
import { cn } from '../../lib/utils/cn';

// Editor props interface
export interface RichEditorProps {
  initialContent?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

// Editor ref interface for external methods
export interface RichEditorRef {
  getJSON: () => Promise<any>;
  getHTML: () => Promise<string>;
  clearContent: () => Promise<void>;
  focus: () => void;
}

// Main Editor component
const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(
  function RichEditor({ initialContent, onChange, placeholder = 'Start writing...', editable = true, className }, ref) {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstance = useRef<EditorJS | null>(null);
    
    // Use this ref to track when the editor has been initialized with content
    const contentInitialized = useRef<boolean>(false);

    // Effect to re-initialize the editor when initialContent changes
    useEffect(() => {
      // If no editor instance or not initialized with this content yet
      if (editorInstance.current && initialContent && !contentInitialized.current) {
        console.log('Updating editor with new initialContent:', initialContent);
        
        try {
          editorInstance.current.isReady.then(() => {
            // Ensure initialContent is in the right format
            const safeContent = processInitialContent(initialContent);
            
            // Clear and render new content
            editorInstance.current?.render(safeContent).then(() => {
              contentInitialized.current = true;
              console.log('Editor content updated successfully');
            }).catch(err => {
              console.error('Failed to render new content:', err);
            });
          }).catch(err => {
            console.error('Editor was not ready:', err);
          });
        } catch (err) {
          console.error('Error updating editor content:', err);
        }
      }
    }, [initialContent]);

    // Helper function to process the initial content
    const processInitialContent = (content: any) => {
      if (!content) {
        return { blocks: [{ type: 'paragraph', data: { text: '' } }] };
      }
      
      // If it's a valid EditorJS data structure, use it
      if (typeof content === 'object' && content !== null && 
          content.blocks && Array.isArray(content.blocks)) {
        return content;
      }
      
      // Handle string or other formats
      if (typeof content === 'string') {
        return {
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: { text: content }
            }
          ]
        };
      }
      
      // If it's an object but not in EditorJS format, convert it
      if (typeof content === 'object') {
        return {
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: { text: JSON.stringify(content) }
            }
          ]
        };
      }
      
      // Fallback
      return { blocks: [{ type: 'paragraph', data: { text: '' } }] };
    };

    // Initialize editor only once when component mounts
    useEffect(() => {
      // Safety check to prevent multiple instances
      if (!editorRef.current) return;
      
      // Add editor styling
      const editorStyle = document.createElement('style');
      editorStyle.textContent = `
        /* Editor styling */
        .codex-editor {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        /* Paragraph styling */
        .ce-paragraph {
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        /* Heading styling */
        .ce-header {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        .ce-header h1 {
          font-size: 2rem;
        }
        
        .ce-header h2 {
          font-size: 1.75rem;
        }
        
        .ce-header h3 {
          font-size: 1.5rem;
        }
        
        .ce-header h4 {
          font-size: 1.25rem;
        }
        
        /* List styling */
        .cdx-list {
          margin-left: 1em;
        }
        
        .cdx-list__item {
          padding: 0.25em 0;
        }
        
        /* Quote styling */
        .cdx-quote {
          border-left: 3px solid #ccc;
          padding-left: 1em;
          font-style: italic;
        }
        
        /* Code block styling */
        .ce-code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          background-color: #f6f8fa;
          border-radius: 4px;
          padding: 0.75em;
        }
        
        /* Table styling */
        .tc-table {
          border-collapse: collapse;
        }
        
        .tc-table td {
          border: 1px solid #e2e8f0;
          padding: 0.5em;
        }
      `;
      document.head.appendChild(editorStyle);

      const createEditor = () => {
        try {
          // Check if initialContent exists and is properly structured
          let safeContent;
          
          if (initialContent) {
            console.log('Initial content provided:', initialContent);
            
            if (typeof initialContent === 'object' && initialContent !== null) {
              if (initialContent.blocks && Array.isArray(initialContent.blocks)) {
                // Valid EditorJS data format
                safeContent = initialContent;
              } else if (typeof initialContent === 'object') {
                // Object but not properly formatted - create a structure with it
                safeContent = {
                  time: Date.now(),
                  blocks: [
                    {
                      type: 'paragraph',
                      data: {
                        text: JSON.stringify(initialContent)
                      }
                    }
                  ]
                };
              }
            } else if (typeof initialContent === 'string') {
              // String content - put it in a paragraph block
              safeContent = {
                time: Date.now(),
                blocks: [
                  {
                    type: 'paragraph',
                    data: {
                      text: initialContent
                    }
                  }
                ]
              };
            }
          }
          
          // If no valid content could be determined, create empty structure
          if (!safeContent) {
            safeContent = { 
              time: Date.now(),
              blocks: [
                { type: 'paragraph', data: { text: '' }}
              ] 
            };
          }
            
          console.log('Initializing Editor.js with data:', safeContent);
          
          // We've already checked editorRef.current exists in the useEffect guard
          const holder = editorRef.current as HTMLElement;
            
          // Create editor instance
          editorInstance.current = new EditorJS({
            holder,
            data: safeContent,
            autofocus: editable,
            placeholder,
            readOnly: !editable,
            tools: {
              header: {
                class: Header,
                inlineToolbar: true,
                config: {
                  levels: [1, 2, 3, 4, 5, 6],
                  defaultLevel: 2
                }
              },
              list: {
                class: List,
                inlineToolbar: true
              },
              quote: {
                class: Quote,
                inlineToolbar: true
              },
              image: {
                class: ImageTool,
                config: {
                  uploader: {
                    async uploadByFile(file: File) {
                      try {
                        const response = await apiClient.uploads.articleImage(file);
                        return {
                          success: 1,
                          file: {
                            url: response.file.url,
                          }
                        };
                      } catch (error) {
                        console.error('Image upload error:', error);
                        return {
                          success: 0,
                          file: {
                            url: null
                          }
                        };
                      }
                    },
                    async uploadByUrl(url: string) {
                      return {
                        success: 1,
                        file: {
                          url: url
                        }
                      };
                    }
                  }
                }
              },
              embed: {
                class: Embed,
                config: {
                  services: {
                    youtube: true,
                    vimeo: true,
                    codepen: true
                  }
                }
              },
              code: Code,
              linkTool: {
                class: LinkTool
              },
              delimiter: Delimiter,
              table: {
                class: Table,
                inlineToolbar: true
              },
              marker: {
                class: Marker
              },
              checklist: {
                class: CheckList,
                inlineToolbar: true
              }
            },
            onChange: onChange ? async () => {
              if (editorInstance.current) {
                try {
                  const content = await editorInstance.current.save();
                  onChange(content);
                } catch (err) {
                  console.error('Error in onChange:', err);
                }
              }
            } : undefined,
            onReady: () => {
              console.log('Editor.js ready');
            }
          });
          
          console.log('Editor.js instance created');
        } catch (err) {
          console.error('Failed to initialize editor:', err);
        }
      };
      
      // Create editor with slight delay to ensure DOM is ready
      const timerId = setTimeout(() => {
        createEditor();
      }, 100);
      
      // Cleanup on unmount
      return () => {
        clearTimeout(timerId);
        
        if (editorInstance.current) {
          try {
            editorInstance.current.isReady
              .then(() => {
                if (editorInstance.current) {
                  editorInstance.current.destroy()
                    .then(() => console.log('Editor destroyed successfully'))
                    .catch(e => console.warn('Error destroying editor:', e));
                }
              })
              .catch(e => console.log('Editor was not ready:', e));
          } catch (error) {
            console.warn('Error during editor cleanup:', error);
          } finally {
            editorInstance.current = null;
          }
        }
      };
    }, []); // Empty dependency array ensures editor is created only once
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getJSON: async () => {
        if (!editorInstance.current) return { blocks: [] };
        try {
          return await editorInstance.current.save();
        } catch (err) {
          console.error('Error getting editor content:', err);
          return { blocks: [] };
        }
      },
      
      getHTML: async () => {
        if (!editorInstance.current) return '';
        try {
          const data = await editorInstance.current.save();
          let html = '';
          
          if (data && data.blocks && Array.isArray(data.blocks)) {
            data.blocks.forEach((block: any) => {
              try {
                switch (block.type) {
                  case 'paragraph':
                    html += `<p>${block.data?.text || ''}</p>`;
                    break;
                  case 'header':
                    const level = block.data?.level || 2;
                    html += `<h${level}>${block.data?.text || ''}</h${level}>`;
                    break;
                  case 'list':
                    const listType = block.data?.style === 'ordered' ? 'ol' : 'ul';
                    html += `<${listType}>`;
                    if (Array.isArray(block.data?.items)) {
                      block.data.items.forEach((item: string) => {
                        html += `<li>${item || ''}</li>`;
                      });
                    }
                    html += `</${listType}>`;
                    break;
                  case 'quote':
                    html += `<blockquote>${block.data?.text || ''}</blockquote>`;
                    if (block.data?.caption) {
                      html += `<cite>${block.data.caption}</cite>`;
                    }
                    break;
                  case 'image':
                    if (block.data?.file?.url) {
                      html += `<figure><img src="${block.data.file.url}" alt="${block.data?.caption || ''}">`;
                      if (block.data?.caption) {
                        html += `<figcaption>${block.data.caption}</figcaption>`;
                      }
                      html += `</figure>`;
                    }
                    break;
                  case 'code':
                    html += `<pre><code>${block.data?.code || ''}</code></pre>`;
                    break;
                  case 'delimiter':
                    html += '<hr>';
                    break;
                  default:
                    break;
                }
              } catch (blockErr) {
                console.error('Error processing block:', blockErr);
              }
            });
          }
          
          return html;
        } catch (err) {
          console.error('Error converting to HTML:', err);
          return '';
        }
      },
      
      clearContent: async () => {
        if (!editorInstance.current || !editorRef.current) return;
        
        try {
          await editorInstance.current.isReady;
          
          // Recreate editor with empty content
          const holder = editorRef.current as HTMLElement;
          
          try {
            await editorInstance.current.destroy();
            editorInstance.current = new EditorJS({
              holder,
              data: { blocks: [{ type: 'paragraph', data: { text: '' } }] },
              placeholder,
              readOnly: !editable,
              onChange: onChange ? async () => {
                if (editorInstance.current) {
                  const content = await editorInstance.current.save();
                  onChange(content);
                }
              } : undefined
            });
          } catch (err) {
            console.error('Error recreating editor:', err);
          }
        } catch (err) {
          console.error('Error clearing editor:', err);
        }
      },
      
      focus: () => {
        if (!editorInstance.current || !editorRef.current) return;
        
        setTimeout(() => {
          try {
            // Try to find and focus the editable element
            const editableElement = editorRef.current?.querySelector('[contenteditable="true"]');
            if (editableElement) {
              (editableElement as HTMLElement).focus();
            }
          } catch (err) {
            console.error('Error focusing editor:', err);
          }
        }, 100);
      }
    }));
    
    return (
      <div className={cn("editor-container", className)}>
        <div 
          ref={editorRef} 
          className="editor-js-instance border border-input rounded-md p-3 min-h-[300px]"
        />
      </div>
    );
  }
);

export { RichEditor };