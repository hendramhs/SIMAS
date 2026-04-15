function NavIcon({ type }) {
  if (type === "report") {
    return (
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 7h6M9 11h6M9 15h4M7 3h8l4 4v14H7V3z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "monitoring") {
    return (
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 19V9M10 19V5M16 19v-8M22 19v-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 17l5-5 3 3 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M19 9h-4V5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default NavIcon;
