
// ABOUTME: Image block component for rendering images with proper responsive behavior.

import React from 'react';

interface ImageBlockData {
  url?: string;
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ImageBlockProps {
  data: ImageBlockData;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ data }) => {
  console.log('ImageBlock data:', data);

  if (!data) {
    return null;
  }

  const imageUrl = data.url || data.src || '';
  const altText = data.alt || data.caption || 'Imagem do review';
  const caption = data.caption;

  if (!imageUrl) {
    return (
      <div className="bg-muted/50 rounded-md p-8 text-center border-2 border-dashed border-muted-foreground/30">
        <p className="text-muted-foreground">Imagem não disponível</p>
      </div>
    );
  }

  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-lg">
        <img 
          src={imageUrl}
          alt={altText}
          className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
