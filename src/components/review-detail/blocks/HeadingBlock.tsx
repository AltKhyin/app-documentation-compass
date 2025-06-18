
// ABOUTME: Heading block component with collapsible functionality per Blueprint 05.

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface HeadingBlockData {
  text?: string;
  content?: string;
  level?: number;
  isCollapsible?: boolean;
}

interface HeadingBlockProps {
  data: HeadingBlockData;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('HeadingBlock data:', data);

  if (!data) {
    return null;
  }

  const headingText = data.text || data.content || '';
  const level = Math.max(1, Math.min(6, data.level || 2)); // Clamp between 1-6
  const isCollapsible = data.isCollapsible || false;

  if (!headingText) {
    return null;
  }

  const handleToggle = () => {
    if (isCollapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Create the appropriate heading element
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // Define heading styles based on level
  const getHeadingClasses = (level: number) => {
    const baseClasses = "font-serif font-bold text-foreground leading-tight";
    
    switch (level) {
      case 1:
        return `${baseClasses} text-4xl mb-6`;
      case 2:
        return `${baseClasses} text-3xl mb-5`;
      case 3:
        return `${baseClasses} text-2xl mb-4`;
      case 4:
        return `${baseClasses} text-xl mb-3`;
      case 5:
        return `${baseClasses} text-lg mb-2`;
      case 6:
        return `${baseClasses} text-base mb-2`;
      default:
        return `${baseClasses} text-2xl mb-4`;
    }
  };

  return (
    <HeadingTag 
      className={`${getHeadingClasses(level)} ${isCollapsible ? 'cursor-pointer flex items-center gap-2 hover:text-primary transition-colors' : ''}`}
      onClick={handleToggle}
    >
      {isCollapsible && (
        isCollapsed ? 
          <ChevronRight className="h-5 w-5 flex-shrink-0" /> : 
          <ChevronDown className="h-5 w-5 flex-shrink-0" />
      )}
      {headingText}
    </HeadingTag>
  );
};

export default HeadingBlock;
