
// ABOUTME: Provides a split-screen layout for authentication pages.
import React from 'react';

const SplitScreenAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-secondary p-12 text-center">
        <div className="w-full max-w-sm">
          <h1 className="text-6xl font-bold font-serif text-primary">
            Reviews.
          </h1>
          <p className="mt-4 text-muted-foreground text-right w-full">
            - por Igor Eckert
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SplitScreenAuthLayout;
