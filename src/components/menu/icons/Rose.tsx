const RoseIcon = ({
size = 64,
    petalColor = "#E0115F", // Default deep pink petals
    petalStroke = "#B22222", // Darker stroke for depth
    stemColor = "#228B22", // Green stem
    leafColor = "#2E8B57" // Slightly darker green leaves
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
            d="M32 40 C30 48, 28 56, 32 64"
            fill="none"
            stroke="#3A7D44"
            stroke-width="3"
            stroke-linecap="round"
        />
    
        <path
            d="M24 50 C14 46, 12 38, 20 36 C26 34, 28 42, 24 50"
            fill="#2E8B57"
            stroke="#2E5D32"
            stroke-width="2"
        />
        <path
            d="M40 50 C50 46, 52 38, 44 36 C38 34, 36 42, 40 50"
            fill="#2E8B57"
            stroke="#2E5D32"
            stroke-width="2"
        />
    
        <g fill="#E63946" stroke="#B22222" stroke-width="2">
            <path d="M32 8 C42 4, 56 12, 52 28 C50 38, 42 44, 32 40 C22 44, 14 38, 12 28 C8 12, 22 4, 32 8 Z"/>
            <path d="M32 10 C40 6, 52 14, 48 26 C46 34, 40 38, 32 36 C24 38, 18 34, 16 26 C12 14, 24 6, 32 10 Z"/>
        </g>
    
        <g fill="#FF4F5E" stroke="#C91D26" stroke-width="2">
            <path d="M32 14 C38 12, 46 18, 44 26 C42 32, 38 34, 32 32 C26 34, 22 32, 20 26 C18 18, 26 12, 32 14 Z"/>
            <path d="M32 18 C36 16, 42 20, 40 26 C38 30, 36 32, 32 30 C28 32, 26 30, 24 26 C22 20, 28 16, 32 18 Z"/>
        </g>
    
        <circle cx="32" cy="24" r="5" fill="#C91D26" stroke="#B22222" stroke-width="1.5"/>
    </svg>
    
    );
  };
  
  export default RoseIcon;
  