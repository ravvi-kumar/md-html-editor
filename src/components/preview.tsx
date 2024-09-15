import React, { useState } from "react";
import { htmlToMarkdown, markdownToHtml } from "../helpers/convert";
import PreviewEditor from "./preview-editor";

function Preview({
  sanitizedHTML,
  mode,
  setText,
}: {
  sanitizedHTML: string;
  mode: "markdown" | "html";
  setText: (text: string) => void;
}) {
  const targetNode = React.useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const save = React.useCallback(() => {
    const html = targetNode.current?.innerHTML;
    if (!html) {
      setIsEditing(false);
      return;
    }
    if (mode === "markdown") {
      const md = htmlToMarkdown(html);
      setText(md);
    } else {
      const htmlParsed = markdownToHtml(html);
      setText(htmlParsed);
    }
    setIsEditing(false);
  }, [mode]);

  return (
    <div className="relative">
      <div className="absolute control-buttons">
        <button className="edit-btn button" onClick={() => setIsEditing(true)}>
          edit
        </button>
        <button className="save-btn button" onClick={save}>
          save
        </button>
      </div>
      {isEditing ? (
        <PreviewEditor text={sanitizedHTML} setText={setText} mode={mode} />
      ) : (
        <div
          ref={targetNode}
          className="preview"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      )}
    </div>
  );
}

export default Preview;
