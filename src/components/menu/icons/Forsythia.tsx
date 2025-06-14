const ForsythiaIcon = ({
size = 64,
    petalColor = "#FFD700", // Golden yellow petals
    centerColor = "#FFA500", // Orange center
    branchColor = "#8B5A2B" // Brown branch/stem
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
            d="M32 60 C30 50, 28 40, 32 30 C36 40, 34 50, 32 60"
            fill="none"
            stroke="#3A7D44"
            stroke-width="3"
            stroke-linecap="round"
        />
    
        <path
            d="M28 42 C18 38, 14 30, 22 28 C28 26, 30 34, 28 42"
            fill="#2E8B57"
            stroke="#2E5D32"
            stroke-width="2"
        />
        <path
            d="M36 42 C46 38, 50 30, 42 28 C36 26, 34 34, 36 42"
            fill="#2E8B57"
            stroke="#2E5D32"
            stroke-width="2"
        />
    
        <g fill="#FFC107" stroke="#DDA520" stroke-width="2">
            <path d="M32 20 C38 10, 50 8, 48 18 C46 26, 38 28, 32 20 Z"/>
            <path d="M32 22 C30 12, 20 8, 22 18 C24 26, 30 28, 32 22 Z"/>
            <path d="M32 24 C26 26, 20 34, 24 38 C28 42, 34 36, 32 24 Z"/>
            <path d="M32 24 C38 26, 44 34, 40 38 C36 42, 30 36, 32 24 Z"/>
        </g>
    
        <circle cx="32" cy="26" r="4" fill="#8B5A2B" stroke="#6B4226" stroke-width="1.5"/>
    </svg>
    
    );
  };
  
  export default ForsythiaIcon;
  