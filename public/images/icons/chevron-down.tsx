import { SVGAttributes } from 'react';

export function ChevronDownIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <path
        d="M32.5 23.001L23.75 32.4241L15 23.001"
        stroke={props.color || '#111011'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronDownIcon;
