import DOMPurify from "dompurify";
import { marked } from "marked";
import React from "react";
import TurndownService from "turndown";

import "./editor.css";
import Preview from "./preview";
import useLocalStorage from "../hooks/useLocalStorage";

type Mode = "markdown" | "html";

const initialText = `# Hello World \n\nThis is a sample text.`;
const turndownService = new TurndownService();

function Editor() {
  const [text, setText] = useLocalStorage("text", initialText);
  const [mode, setMode] = useLocalStorage<Mode>("mode", "markdown");

  React.useEffect(() => {
    (async () => {
      if (mode === "html") {
        const html = await marked.parse(text);
        setText(html);
      } else {
        const md = turndownService.turndown(text);
        const nextMd = turndownService.turndown(md);
        // #NOTE: checking if the text starts with "/" means that it's a already in markdown format
        if (nextMd.startsWith("\\") || nextMd === md) {
          setText(text);
        } else {
          setText(md);
        }
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
