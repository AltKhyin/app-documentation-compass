
// ABOUTME: Controller component that selects the correct block component based on node type per Blueprint 05.

import React from 'react';
import TextBlock from './blocks/TextBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ImageBlock from './blocks/ImageBlock';

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

interface BlockRendererProps {
  node: NodeObject;
  layout: LayoutObject | null;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ node, layout }) => {
  console.log('BlockRenderer:', { node, layout });

  // Build grid positioning styles from layout object
  const gridStyles: React.CSSProperties = {};
  if (layout) {
    if (layout.gridColumn) gridStyles.gridColumn = layout.gridColumn;
    if (layout.gridRow) gridStyles.gridRow = layout.gridRow;
    if (layout.gridArea) gridStyles.gridArea = layout.gridArea;
  }

  // Render the wrapper div with grid positioning
  const renderBlock = () => {
    switch (node.type) {
      case 'heading':
        return <HeadingBlock data={node.data} />;
      
      case 'text':
      case 'paragraph':
        return <TextBlock data={node.data} />;
      
      case 'image':
        return <ImageBlock data={node.data} />;
      
      default:
        console.warn(`Unknown block type: ${node.type}`);
        return (
          <div className="p-4 bg-muted/50 rounded-md border-2 border-dashed border-muted-foreground/30">
            <p className="text-sm text-muted-foreground">
              Tipo de bloco não suportado: <code className="bg-muted px-1 py-0.5 rounded">{node.type}</code>
            </p>
            {node.data && (
              <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(node.data, null, 2)}
              </pre>
            )}
          </div>
        );
    }
  };

  return (
    <div style={gridStyles} className="block-wrapper">
      {renderBlock()}
    </div>
  );
};

export default BlockRenderer;
