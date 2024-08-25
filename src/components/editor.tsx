import DOMPurify from "dompurify";
import { marked } from "marked";
import React from "react";

import "./editor.css";
import Preview from "./preview";
import useLocalStorage from "../hooks/useLocalStorage";
import { htmlToMarkdown, markdownToHtml } from "../helpers/convert";

type Mode = "markdown" | "html";

const initialText = `# Hello World \n\nThis is a sample text.`;

function Editor() {
  const [text, setText] = useLocalStorage("text", initialText);
  const [mode, setMode] = useLocalStorage<Mode>("mode", "markdown");

  React.useEffect(() => {
    (async () => {
      if (mode === "html") {
        const html = markdownToHtml(text);
        setText(html);
      } else {
        const md = htmlToMarkdown(text);
        setText(md);
      }
    })();
  }, [mode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const toggleMode = React.useCallback(() => {
    setMode(mode === "markdown" ? "html" : "markdown");
  }, [mode]);

  const sanitizedHTML = React.useMemo(() => {
    if (mode === "markdown") {
      const html = marked.parse(text);
      return DOMPurify.sanitize(html as string);
    } else {
      return DOMPurify.sanitize(text);
    }
  }, [mode, text]);

  return (
    <div className="editor">
      <div className="controls">
        <button className="button" onClick={toggleMode}>
          Switch to {mode === "markdown" ? "HTML" : "Markdown"}
        </button>
      </div>
      <div className="container">
        <div className="editor-container">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={`Enter your ${mode} here...`}
          />
        </div>
        <div className="preview-container">
          <Preview sanitizedHTML={sanitizedHTML} />
        </div>
      </div>
    </div>
  );
}

export default Editor;
