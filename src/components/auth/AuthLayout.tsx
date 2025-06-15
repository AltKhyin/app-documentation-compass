
// ABOUTME: Provides the consistent centered card layout for authentication pages.
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 font-serif text-primary">
          EVIDENS
        </h1>
        <div className="bg-card p-8 rounded-lg border">
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
