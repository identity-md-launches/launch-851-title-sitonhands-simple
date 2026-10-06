export function Icon({
  name,
  size = 20,
}: {
  name:
    | "arrow"
    | "wallet"
    | "lock"
    | "clock"
    | "external"
    | "check"
    | "refresh"
    | "close"
    | "info"
    | "hand";
  size?: number;
}) {
  const paths = {
    arrow: (
      <>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 8V5H5a2 2 0 0 0 0 4h16v11H5a2 2 0 0 1-2-2V7" />
        <path d="M21 12h-6v5h6m-3-2.5h.1" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6m-1-5-9 9m0-10H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    refresh: (
      <>
        <path d="M20 10a8 8 0 1 0-1 7M20 4v6h-6" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10h.01" />
      </>
    ),
    hand: (
      <>
        <path d="M8 11V5m4 6V3m4 8V5m4 7V8M8 10 5 8c-2-1-4 1-2 3l5 8c3 4 12 2 12-4v-4M4 23h17" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Hourglass() {
  return (
    <svg
      className="hourglass"
      viewBox="0 0 360 270"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="glass"
          x1="120"
          y1="65"
          x2="230"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6c8155" stopOpacity=".2" />
          <stop offset="1" stopColor="#b7d38e" stopOpacity=".03" />
        </linearGradient>
        <linearGradient
          id="sand"
          x1="180"
          y1="170"
          x2="180"
          y2="223"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d0ef9b" />
          <stop offset="1" stopColor="#657746" />
        </linearGradient>
      </defs>
      <ellipse
        cx="186"
        cy="149"
        rx="151"
        ry="72"
        transform="rotate(-23 186 149)"
        stroke="#3d4633"
        strokeDasharray="2 7"
      />
      <ellipse
        cx="186"
        cy="149"
        rx="148"
        ry="111"
        transform="rotate(22 186 149)"
        stroke="#282f24"
      />
      <path
        d="M128 57h110M128 228h110"
        stroke="#91a779"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M136 61c0 53 9 56 36 79 4 3 4 8 0 11-27 23-36 29-36 73h94c0-44-9-50-36-73-4-3-4-8 0-11 27-23 36-26 36-79Z"
        fill="url(#glass)"
        stroke="#667a51"
        strokeWidth="1.5"
      />
      <path
        d="M144 85h77c-4 22-15 32-37 47-22-15-34-25-40-47Z"
        fill="#b9d68a"
        fillOpacity=".52"
      />
      <path d="m142 219 40-41a3 3 0 0 1 4 0l38 41Z" fill="url(#sand)" />
      <path
        d="M183 146v21"
        stroke="#c8e896"
        strokeWidth="2"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
      <path
        d="M145 66c0 27 3 43 17 56m-18 77c3-12 7-19 17-28"
        stroke="#b2c49b"
        strokeOpacity=".3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="47" cy="188" r="5" fill="#c8f17c" />
      <circle cx="313" cy="90" r="3" fill="#87976f" />
      <path
        d="M291 197v12m-6-6h12M81 72v8m-4-4h8"
        stroke="#869575"
        strokeWidth="1.5"
      />
    </svg>
  );
}
