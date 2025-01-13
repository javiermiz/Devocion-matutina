// lib/content-utils.ts
export interface ProcessedTitle {
  audience: string;
  title: string;
}

export function processTitle(fullTitle: string): ProcessedTitle {
  const match = fullTitle.match(/Matutina para ([^2]+) 2025 \| (.+)$/);
  return {
    audience: match ? match[1].trim() : '',
    title: match ? match[2].trim() : fullTitle,
  };
}

export function cleanHTML(html: string): string {
  // Remover elementos no deseados usando regex
  const removePatterns = [
    /<div[^>]*id="attachment_[^>]*>.*?<\/div>/g,
    /<div[^>]*class="wp-caption[^>]*>.*?<\/div>/g,
    /<div[^>]*class="wp-block-latest-posts[^>]*>.*?<\/div>/g,
    /<div[^>]*class="wp-block-separator[^>]*>.*?<\/div>/g,
    /<div[^>]*class="bawpvc-ajax-counter[^>]*>.*?<\/div>/g,
    /<div[^>]*class="d_reactions[^>]*>.*?<\/div>/g,
    /<hr[^>]*>/g,
    /<div[^>]*class="wp-caption-text[^>]*>.*?<\/div>/g,
  ];

  let cleanedHTML = html;
  removePatterns.forEach((pattern) => {
    cleanedHTML = cleanedHTML.replace(pattern, '');
  });

  // Limpiar estilos inline
  cleanedHTML = cleanedHTML.replace(/\s+style="[^"]*"/g, '');

  // Limpiar clases
  cleanedHTML = cleanedHTML.replace(/\s+class="[^"]*"/g, '');

  // Limpiar IDs
  cleanedHTML = cleanedHTML.replace(/\s+id="[^"]*"/g, '');

  // Procesar iframes de SoundCloud
  cleanedHTML = cleanedHTML
    .replace(
      /(<iframe[^>]*soundcloud\.com[^>]*>)/g,
      '<div class="soundcloud-wrapper">$1'
    )
    .replace(/(<iframe[^>]*soundcloud\.com[^>]*>.*?<\/iframe>)/g, '$1</div>');

  return cleanedHTML;
}

export function cleanContent(content: string, mainTitle: string): string {
  // Primero limpiamos el HTML
  let cleanedContent = cleanHTML(content);

  // Remover headings específicos usando regex
  const headingPatterns = [
    new RegExp(`<h[1-6][^>]*>${mainTitle}<\/h[1-6]>`, 'gi'),
    /<h[1-6][^>]*>.*?devoción matutina.*?<\/h[1-6]>/gi,
    /<h[1-6][^>]*>={3,}<\/h[1-6]>/gi,
  ];

  headingPatterns.forEach((pattern) => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  // Convertir headings largos en párrafos
  cleanedContent = cleanedContent.replace(
    /<h([1-6])[^>]*>((?:(?!<\/h\1>).)*?)<\/h\1>/gi,
    (match, level, content) => {
      const words = content.split(/\s+/).length;
      if (words > 20 || content.length > 150) {
        return `<p>${content}</p>`;
      }
      return match;
    }
  );

  return cleanedContent;
}
