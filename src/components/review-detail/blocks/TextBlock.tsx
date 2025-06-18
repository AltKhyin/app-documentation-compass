
// ABOUTME: Text block component for rendering paragraph content with rich text support.

import React from 'react';

interface TextBlockData {
  content?: string;
  text?: string;
  html?: string;
  format?: 'plain' | 'markdown' | 'html';
}

interface TextBlockProps {
  data: TextBlockData;
}

const TextBlock: React.FC<TextBlockProps> = ({ data }) => {
  console.log('TextBlock data:', data);

  if (!data) {
    return null;
  }

  // Get text content from various possible fields
  const textContent = data.content || data.text || data.html || '';

  if (!textContent) {
    return null;
  }

  // Handle different text formats
  if (data.format === 'html' || data.html) {
    return (
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    );
  }

  // For now, treat everything else as plain text
  // TODO: Add markdown support when needed
  return (
    <p className="text-foreground leading-relaxed text-base">
      {textContent}
    </p>
  );
};

export default TextBlock;
