
// ABOUTME: A simple 'R.' logo component for the collapsed sidebar.
import React from 'react';

const RLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.957 21.175V6.825H14.133C15.113 6.825 15.917 7.035 16.545 7.455C17.173 7.875 17.487 8.52 17.487 9.39C17.487 10.02 17.325 10.56 17.001 11.01C16.677 11.46 16.143 11.835 15.399 12.135L17.907 21.175H14.967L12.549 12.425H12.501V21.175H10.957ZM12.501 11.025H14.085C14.541 11.025 14.881 10.89 15.105 10.62C15.337 10.35 15.453 10.005 15.453 9.585C15.453 9.145 15.324 8.799 15.066 8.547C14.808 8.295 14.433 8.17 13.941 8.17H12.501V11.025Z"
      fill="currentColor"
    />
    <path d="M22.5 21.5V22H23V21.5H22.5Z" fill="currentColor" />
    <circle cx="23" cy="21.5" r="0.5" fill="currentColor" />
  </svg>
);

export default RLogo;
