const CamelliaIcon = ({
 size = 64,
    petalColor = "#FF4F79", // Default deep pink petals
    petalStroke = "#C71585", // Darker pink outline
    centerColor = "#FFD700", // Golden yellow center
    stemColor = "#228B22", // Green stem
    leafColor = "#2E8B57" // Dark green leaves
  }) => {
    return (
        <svg
        width={size}
        height={size}
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 36 C31 50, 31 62, 32 72 C33 62, 33 50, 32 36 Z"
          fill="#228B22"
          stroke="#006400"
          stroke-width="3"
        />

        <path
          d="M24 50 C16 48, 14 40, 20 38 C26 36, 28 44, 24 50 C28 54, 30 58, 32 60"
          fill="#2E8B57"
          stroke="#2E5D32"
          stroke-width="2"
        />
        <path
          d="M40 50 C48 48, 50 40, 44 38 C38 36, 36 44, 40 50 C36 54, 34 58, 32 60"
          fill="#2E8B57"
          stroke="#2E5D32"
          stroke-width="2"
        />

        <g fill="#FF4F79" stroke="#C71585" stroke-width="1.5">
          <circle cx="32" cy="24" r="12" />
          <circle cx="24" cy="28" r="10" />
          <circle cx="40" cy="28" r="10" />
          <circle cx="28" cy="36" r="10" />
          <circle cx="36" cy="36" r="10" />
        </g>
  
        <circle cx="32" cy="30" r="5" fill="#FFD700" stroke="#B8860B" stroke-width="1.5" />
  
      </svg>

    );
  };
  
  export default CamelliaIcon;
  