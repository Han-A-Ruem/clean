const SunflowerIcon = ({
size = 64,
  petalColor = "#FFD700", // Default sunflower yellow
  petalStroke = "#DAA520", // Golden stroke for depth
  centerColor = "#8B4513", // Brown center
  stemColor = "#228B22", // Green stem
  leafColor = "#2E8B57" // Dark green leaves
}) => {
  return (
    <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M32 40 C30 50, 28 60, 32 64"
        fill="none"
        stroke="#3A7D44"
        stroke-width="4"
        stroke-linecap="round"
    />

    <path
        d="M20 46 C6 38, 10 22, 18 24 C26 26, 24 38, 20 46"
        fill="#2E8B57"
        stroke="#2E5D32"
        stroke-width="2"
    />
    <path
        d="M44 46 C58 38, 54 22, 46 24 C38 26, 40 38, 44 46"
        fill="#2E8B57"
        stroke="#2E5D32"
        stroke-width="2"
    />

    <g fill="#FFC107" stroke="#DDA520" stroke-width="2">
        <ellipse cx="32" cy="14" rx="5" ry="10"/>
        <ellipse cx="42" cy="16" rx="5" ry="10" transform="rotate(30 42 16)"/>
        <ellipse cx="50" cy="22" rx="5" ry="10" transform="rotate(60 50 22)"/>
        <ellipse cx="54" cy="32" rx="5" ry="10" transform="rotate(90 54 32)"/>
        <ellipse cx="50" cy="42" rx="5" ry="10" transform="rotate(120 50 42)"/>
        <ellipse cx="42" cy="48" rx="5" ry="10" transform="rotate(150 42 48)"/>
        <ellipse cx="32" cy="50" rx="5" ry="10" transform="rotate(180 32 50)"/>
        <ellipse cx="22" cy="48" rx="5" ry="10" transform="rotate(210 22 48)"/>
        <ellipse cx="14" cy="42" rx="5" ry="10" transform="rotate(240 14 42)"/>
        <ellipse cx="10" cy="32" rx="5" ry="10" transform="rotate(270 10 32)"/>
        <ellipse cx="14" cy="22" rx="5" ry="10" transform="rotate(300 14 22)"/>
        <ellipse cx="22" cy="16" rx="5" ry="10" transform="rotate(330 22 16)"/>
    </g>

    <circle cx="32" cy="32" r="12" fill="#8B5A2B" stroke="#6B4226" stroke-width="2"/>

    <circle cx="28" cy="28" r="2" fill="#6B4226"/>
    <circle cx="36" cy="28" r="2" fill="#6B4226"/>
    <circle cx="30" cy="34" r="2" fill="#6B4226"/>
    <circle cx="34" cy="34" r="2" fill="#6B4226"/>
    <circle cx="32" cy="30" r="2" fill="#6B4226"/>
</svg>

  );
};

export default SunflowerIcon;
