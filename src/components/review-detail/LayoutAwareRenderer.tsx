
// ABOUTME: Core rendering engine for structured content v2.0 that handles responsive layouts per Blueprint 05.

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import BlockRenderer from './BlockRenderer';

interface LayoutObject {
  id: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
}

interface NodeObject {
  id: string;
  type: string;
  data: any;
}

interface StructuredContentV2 {
  nodes: NodeObject[];
  layouts: {
    desktop: LayoutObject[];
    mobile: LayoutObject[];
  };
}

interface LayoutAwareRendererProps {
  content: StructuredContentV2;
}

const LayoutAwareRenderer: React.FC<LayoutAwareRendererProps> = ({ content }) => {
  const isMobile = useIsMobile();

  console.log('LayoutAwareRenderer:', { content, isMobile });

  if (!content || !content.nodes || !Array.isArray(content.nodes)) {
    console.warn('Invalid structured content:', content);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Conteúdo não disponível no formato esperado.
        </p>
      </div>
    );
  }

  // Select appropriate layout based on viewport
  const selectedLayout = isMobile 
    ? content.layouts?.mobile || [] 
    : content.layouts?.desktop || [];

  console.log('Selected layout:', { isMobile, selectedLayout });

  // If no layout is defined, render nodes in simple vertical order
  if (!selectedLayout || selectedLayout.length === 0) {
    console.log('No layout defined, using simple vertical rendering');
    return (
      <div className="space-y-6">
        {content.nodes.map((node) => (
          <BlockRenderer 
            key={node.id} 
            node={node} 
            layout={null}
          />
        ))}
      </div>
    );
  }

  // Grid-based rendering with layout positioning
  return (
    <div 
      className="grid gap-6"
      style={{
        // Dynamic grid setup - will be enhanced when we have real structured content
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(auto, auto)'
      }}
    >
      {content.nodes.map((node) => {
        // Find corresponding layout object for this node
        const layoutObj = selectedLayout.find(layout => layout.id === node.id);
        
        return (
          <BlockRenderer 
            key={node.id} 
            node={node} 
            layout={layoutObj || null}
          />
        );
      })}
    </div>
  );
};

export default LayoutAwareRenderer;
