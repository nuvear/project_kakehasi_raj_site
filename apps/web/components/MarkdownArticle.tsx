import React from "react";

interface MarkdownArticleProps {
  content: string;
}

type ListMode = "ul" | "ol";

function stripFrontmatter(content: string) {
  if (!content.trimStart().startsWith("---")) {
    return content.trim();
  }
  const parts = content.split("---");
  return parts.length > 2 ? parts.slice(2).join("---").trim() : content.trim();
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code className="markdown-inline-code" key={`${match.index}-code`}>
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = /^https?:\/\//.test(href);
        nodes.push(
          <a
            className="markdown-link"
            key={`${match.index}-link`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {label}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function MarkdownArticle({ content }: MarkdownArticleProps) {
  const body = stripFrontmatter(content);
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listMode: ListMode | null = null;

  const flushList = (key: string) => {
    if (listItems.length === 0 || !listMode) return;

    const ListTag = listMode;
    elements.push(
      <ListTag key={key} className="markdown-list">
        {listItems.map((item, index) => (
          <li key={`${key}-${index}`}>
            {renderInline(item)}
          </li>
        ))}
      </ListTag>
    );
    listItems = [];
    listMode = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const numberedMatch = trimmed.match(/^\d+\.\s+(.*)$/);

    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    if (trimmed === "---") {
      flushList(`list-${index}`);
      elements.push(<hr className="markdown-rule" key={index} />);
      return;
    }

    if (trimmed.startsWith("#### ")) {
      flushList(`list-${index}`);
      const text = trimmed.slice(5);
      elements.push(
        <h4 className="markdown-heading-4" key={index} id={slugify(text)}>
          {renderInline(text)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(`list-${index}`);
      const text = trimmed.slice(4);
      elements.push(
        <h4 className="markdown-heading-4" key={index} id={slugify(text)}>
          {renderInline(text)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`list-${index}`);
      const text = trimmed.slice(3);
      elements.push(
        <h3 className="markdown-heading-3" key={index} id={slugify(text)}>
          {renderInline(text)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(`list-${index}`);
      const text = trimmed.slice(2);
      elements.push(
        <h2 className="markdown-heading-2" key={index} id={slugify(text)}>
          {renderInline(text)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listMode !== "ul") {
        flushList(`list-${index}-switch`);
        listMode = "ul";
      }
      listItems.push(trimmed.slice(2));
      return;
    }

    if (numberedMatch) {
      if (listMode !== "ol") {
        flushList(`list-${index}-switch`);
        listMode = "ol";
      }
      listItems.push(numberedMatch[1]);
      return;
    }

    flushList(`list-${index}`);
    elements.push(
      <p className="markdown-paragraph" key={index}>
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList("list-final");

  return <div className="markdown-article">{elements}</div>;
}
