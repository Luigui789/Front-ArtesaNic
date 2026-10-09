import { useEffect } from "react";

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface DocumentHeadOptions {
  title: string;
  meta?: MetaTag[];
  canonical?: string;
}

export function useDocumentHead({ title, meta = [], canonical }: DocumentHeadOptions) {
  useEffect(() => {
    document.title = title;
    const created: HTMLElement[] = [];

    for (const tag of meta) {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (tag.name) el.setAttribute("name", tag.name);
        if (tag.property) el.setAttribute("property", tag.property);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", tag.content);
    }

    let canonicalEl: HTMLLinkElement | null = null;
    if (canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
        created.push(canonicalEl);
      }
      canonicalEl.setAttribute("href", canonical);
    }

    return () => {
      for (const el of created) el.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, JSON.stringify(meta), canonical]);
}
