import { type SVGAttributes } from "react";

interface Props extends SVGAttributes<SVGElement> {
  color?: string;
  hasFill?: boolean;
}

export function Edit(props: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <path
        d="M4.75 19.2499L9 18.2499L18.2929 8.95696C18.6834 8.56643 18.6834 7.93327 18.2929 7.54274L16.4571 5.70696C16.0666 5.31643 15.4334 5.31643 15.0429 5.70696L5.75 14.9999L4.75 19.2499Z"
        stroke={props.color || "#111011"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={props.hasFill ? "#111011" : "none"}
      />
      <path
        d="M19.25 19.25H13.75"
        stroke={props.color || "#111011"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Edit;
