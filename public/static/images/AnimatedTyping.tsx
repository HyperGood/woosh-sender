import { useEffect, useRef, useState } from 'react';

export function AnimatedTyping() {
  let activeOne = false;

  const darkColor = '#7E8185';
  const lightColor = '#CFD0D1';

  //Can we make this into an array of refs?
  const dotOneRef = useRef<SVGRectElement>(null);
  //   const dotTwoRef = useRef(null);
  //   const dotThreeRef = useRef(null);

  //A function that changes the color every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      activeOne = !activeOne;
      if (dotOneRef.current && dotOneRef.current.attributes[5])
        dotOneRef.current.attributes[5].value = activeOne
          ? darkColor
          : lightColor;
      //wait 300ms and change to activeFalse and move to the next one

      //Repeat for all refs
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width="85"
      height="49"
      viewBox="0 0 85 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0176 18.8889C11.0176 8.45684 19.4744 0 29.9065 0H66.1102C76.5422 0 84.9991 8.45684 84.9991 18.8889C84.9991 29.3209 76.5422 37.7778 66.1102 37.7778H29.9065C27.4397 37.7778 25.0834 37.3049 22.9232 36.4449C21.6044 39.542 18.5329 41.7133 14.9543 41.7133C10.1729 41.7133 6.29688 37.8372 6.29688 33.0558C6.29688 29.3122 8.67305 26.1235 11.9995 24.9158C11.3627 23.023 11.0176 20.9963 11.0176 18.8889ZM3.93519 40.1387C1.76184 40.1387 0 41.9005 0 44.0739C0 46.2472 1.76184 48.009 3.93519 48.009C6.10853 48.009 7.87037 46.2472 7.87037 44.0739C7.87037 41.9005 6.10853 40.1387 3.93519 40.1387Z"
        fill="#E8E9EA"
      />
      <rect
        x="29.9082"
        y="14.9531"
        width="7.87037"
        height="7.87037"
        rx="3.93519"
        fill="#CFD0D1"
        ref={dotOneRef}
      />
      <rect
        x="44.0742"
        y="14.9531"
        width="7.87037"
        height="7.87037"
        rx="3.93519"
        fill="#CFD0D1"
        // ref={dotTwoRef}
      />
      <rect
        x="58.2402"
        y="14.9531"
        width="7.87037"
        height="7.87037"
        rx="3.93519"
        fill="#CFD0D1"
        // ref={dotThreeRef}
      />
    </svg>
  );
}
