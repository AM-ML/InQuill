declare module '@editorjs/editorjs' {
  export default class EditorJS {
    constructor(options: any);
    save(): Promise<any>;
    destroy(): void;
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