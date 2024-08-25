import TurndownService from "turndown";
import { marked } from "marked";

export function markdownToHtml(markdown: string) {
  const html = marked.parse(markdown);
  return html as string;
}

export function htmlToMarkdown(html: string) {
  const turndownService = new TurndownService();

  //   #NOTE : if the text is already in markdown format,
  //  then convert it to html and then to markdown
  const htmlParsed = markdownToHtml(html);
  const markdown = turndownService.turndown(htmlParsed);
  return markdown;
}
