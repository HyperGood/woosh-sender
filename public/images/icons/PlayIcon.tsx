import { SVGAttributes } from 'react';

interface Props extends SVGAttributes<SVGElement> {
  color: string;
  hasFill?: boolean;
}

export function PlayIcon(props: Props) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        stroke={props.color}
        fill={props.color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
      ></path>
    </svg>
  );
}

export default PlayIcon;
