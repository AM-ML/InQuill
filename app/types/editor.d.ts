declare module '@editorjs/editorjs' {
  interface EditorConfig {
    holder: string | HTMLElement;
    tools?: any;
    data?: any;
    placeholder?: string;
    autofocus?: boolean;
    readOnly?: boolean;
    onChange?: () => void;
    onReady?: () => void;
  }

  export interface API {
    clear(): void;
  }

  export interface BlockAPI {
    clear(): void;
    insert(type: string, data?: any): void;
  }

  export default class EditorJS {
    constructor(options: EditorConfig);
    
    // Standard methods
    save(): Promise<any>;
    destroy(): Promise<void>;
    
    // Extended methods that might be available
    render(data: any): Promise<void>;
    clear(): void;
    
    // Properties
    isReady: Promise<void>;
    blocks: BlockAPI;
  }
}

declare module '@editorjs/header' {
  const Header: any;
  export default Header;
}

declare module '@editorjs/paragraph' {
  const Paragraph: any;
  export default Paragraph;
}

declare module '@editorjs/list' {
  const List: any;
  export default List;
}

declare module '@editorjs/quote' {
  const Quote: any;
  export default Quote;
}

declare module '@editorjs/image' {
  const Image: any;
  export default Image;
}

declare module '@editorjs/link' {
  const LinkTool: any;
  export default LinkTool;
}

declare module '@editorjs/embed' {
  const Embed: any;
  export default Embed;
}

declare module '@editorjs/delimiter' {
  const Delimiter: any;
  export default Delimiter;
}

declare module '@editorjs/code' {
  const Code: any;
  export default Code;
}

declare module '@editorjs/marker';
declare module '@editorjs/checklist';
declare module '@editorjs/table'; 