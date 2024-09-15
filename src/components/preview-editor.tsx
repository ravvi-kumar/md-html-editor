import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useCallback, useEffect } from "react";

type Mode = "markdown" | "html";
type PreviewEditorProps = {
  mode: Mode;
  text: string;
  setText: (text: string) => void;
};

function PreviewEditor({ mode, text, setText }: PreviewEditorProps) {
  const editor = useCreateBlockNote();

  const onSave = useCallback(async () => {
    (async () => {
      if (mode === "markdown") {
        const md = await editor.blocksToMarkdownLossy(editor.document);
        setText(md);
      } else {
        const html = await editor.blocksToHTMLLossy(editor.document);
        setText(html);
      }
    })();
  }, [mode, editor]);

  useEffect(() => {
    (async () => {
      debugger;
      const blocks = await editor.tryParseHTMLToBlocks(text);
      editor.replaceBlocks(editor.document, blocks);
    })();

    return () => {
      onSave();
    };
  }, []);

  return (
    <div className="">
      <BlockNoteView editor={editor} />
    </div>
  );
}

export default PreviewEditor;
