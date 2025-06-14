const CosmosIcon = ({
size = 64,
    petalColor = "#FF69B4", // Default pink petals
    petalStroke = "#C71585", // Darker pink outline
    centerColor = "#FFD700", // Golden yellow center
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
        {/* Petals */}
        <g fill={petalColor} stroke={petalStroke} strokeWidth="1.5">
          <path d="M32 8 C40 4, 48 10, 46 18 C44 26, 34 30, 32 20 C30 30, 20 26, 18 18 C16 10, 24 4, 32 8 Z" />
          <path d="M32 8 C38 2, 46 4, 44 14 C42 22, 34 26, 32 18 C30 26, 22 22, 20 14 C18 4, 26 2, 32 8 Z" />
          <path d="M32 8 C34 2, 40 2, 42 10 C44 18, 38 24, 32 18 C26 24, 20 18, 22 10 C24 2, 30 2, 32 8 Z" />
        </g>
  
        {/* Center */}
        <circle cx="32" cy="18" r="6" fill={centerColor} stroke="#B8860B" strokeWidth="1.5" />
  
        {/* Stem */}
        <path
          d="M32 50 C28 46, 30 40, 32 36 C34 40, 36 46, 32 50 Z"
          fill={stemColor}
          stroke="#006400"
          strokeWidth="3"
        />
  
        {/* Leaves */}
        <path
          d="M24 40 C16 38, 14 30, 20 28 C26 26, 28 34, 24 40"
          fill={leafColor}
          stroke="#2E5D32"
          strokeWidth="2"
        />
        <path
          d="M40 40 C48 38, 50 30, 44 28 C38 26, 36 34, 40 40"
          fill={leafColor}
          stroke="#2E5D32"
          strokeWidth="2"
        />
      </svg>
    );
  };
  
  export default CosmosIcon;
  