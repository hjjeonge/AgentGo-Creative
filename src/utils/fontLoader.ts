/**
 * Dynamically loads a Google Font by creating a <link> element in the document's <head>.
 * It checks if the font has already been loaded to avoid duplicates.
 */
export const loadGoogleFont = (fontFamily: string) => {
  const fontId = `google-font-${fontFamily.replace(/ /g, '-')}`;

  // Don't load if the font link already exists
  if (document.getElementById(fontId)) {
    return;
  }

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  // Request Regular (400), Bold (700), Italic (400), Bold Italic (700) styles
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
  
  document.head.appendChild(link);
};
