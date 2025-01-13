// lib/content-utils.ts
import { JSDOM } from 'jsdom';

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
  const dom = new JSDOM(html);
  const tempDiv = dom.window.document.createElement('div');
  tempDiv.innerHTML = html;

  // Función auxiliar para eliminar elementos basados en un selector
  const removeElements = (selector: string) => {
    tempDiv.querySelectorAll(selector).forEach((el) => el.remove());
  };

  // Remover elementos específicos
  const removePatterns = [
    '[id^="attachment_"]',
    '.wp-caption',
    '.wp-block-latest-posts',
    '.wp-block-separator',
    '.bawpvc-ajax-counter',
    '.d_reactions',
    'hr',
    '.wp-caption-text',
    '.soundcloud-wrapper',
    'iframe[src*="soundcloud.com"]',
  ];

  // Eliminar elementos según los patrones
  removePatterns.forEach((pattern) => removeElements(pattern));

  // Eliminar divs que contienen enlaces de Soundcloud
  tempDiv.querySelectorAll('div').forEach((div) => {
    const soundcloudLinks = div.querySelectorAll('a[href*="soundcloud.com"]');
    if (soundcloudLinks.length > 0) {
      div.remove();
    }
  });

  // Eliminar listas que contienen enlaces a devocionmatutina.com
  tempDiv.querySelectorAll('ul').forEach((ul) => {
    const devotionalLinks = ul.querySelectorAll(
      'a[href*="devocionmatutina.com"]'
    );
    if (devotionalLinks.length > 0) {
      ul.remove();
    }
  });

  // Limpiar atributos innecesarios de los elementos restantes
  tempDiv.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('id');
  });

  return tempDiv.innerHTML;
}

export function cleanContent(content: string, mainTitle: string): string {
  // Primero limpiamos el HTML usando jsdom
  const cleanedContent = cleanHTML(content);

  // Detectar y eliminar el patrón ========== y todo lo que sigue
  const parts = cleanedContent.split(/={10,}/);
  const contentBeforePattern = parts[0];

  const dom = new JSDOM(contentBeforePattern);
  const tempDiv = dom.window.document.createElement('div');
  tempDiv.innerHTML = contentBeforePattern;

  // Remover headings específicos
  tempDiv.querySelectorAll('h1, h2').forEach((heading) => {
    const text = heading.textContent?.toLowerCase() || '';
    if (
      text === mainTitle.toLowerCase() ||
      text.includes('devoción matutina')
    ) {
      heading.remove();
    }
  });

  // Convertir headings largos en párrafos
  tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const content = heading.textContent || '';
    const words = content.split(/\s+/).length;
    if (words > 20 || content.length > 150) {
      const p = dom.window.document.createElement('p');
      p.textContent = content;
      heading.replaceWith(p);
    }
  });

  return tempDiv.innerHTML;
}
