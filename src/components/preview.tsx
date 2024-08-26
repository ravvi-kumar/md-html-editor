import React from "react";
import { htmlToMarkdown, markdownToHtml } from "../helpers/convert";

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

  const save = React.useCallback(() => {
    const html = targetNode.current?.innerHTML;
    if (!html) return;
    if (mode === "markdown") {
      const md = htmlToMarkdown(html);
      setText(md);
    } else {
      const htmlParsed = markdownToHtml(html);
      setText(htmlParsed);
    }
  }, [mode]);

  return (
    <div className="relative">
      <button className="save-btn button" onClick={save}>
        save
      </button>
      <div
        ref={targetNode}
        contentEditable={true}
        className="preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}

export default Preview;
