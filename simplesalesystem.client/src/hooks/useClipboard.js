import { useCallback } from 'react';

export function useClipboard() {
  const copy = useCallback(async (text) => {
    if (!text) return;

    // 1️⃣ Try modern Clipboard API first
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        console.log('Copied using navigator.clipboard');
        return true;
      } catch (err) {
        console.warn('Clipboard API failed, falling back...', err);
      }
    }

    // 2️⃣ Fallback using execCommand (works without HTTPS)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Fallback copy failed', err);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }, []);

  return copy;
}