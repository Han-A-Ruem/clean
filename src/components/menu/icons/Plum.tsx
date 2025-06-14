
const PlumIcon = ({
  size = 64,
  plumColor = "#8E4585", // Default purple plum
  strokeColor = "#6D2C6D",
  leafColor = "#3A7D44",
  leafStroke = "#2E5D3A"
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="pink" />
        </radialGradient>
      </defs>
    
      <circle cx="100" cy="50" r="40" fill="url(#petalGradient)" />
      <circle cx="50" cy="100" r="40" fill="url(#petalGradient)" />
      <circle cx="150" cy="100" r="40" fill="url(#petalGradient)" />
      <circle cx="75" cy="150" r="40" fill="url(#petalGradient)" />
      <circle cx="125" cy="150" r="40" fill="url(#petalGradient)" />
    
      <circle cx="100" cy="100" r="15" fill="gold" />
    
      <g stroke="gold" strokeWidth="2">
        <line x1="100" y1="85" x2="100" y2="60" />
        <line x1="85" y1="100" x2="60" y2="100" />
        <line x1="115" y1="100" x2="140" y2="100" />
        <line x1="92" y1="115" x2="75" y2="140" />
        <line x1="108" y1="115" x2="125" y2="140" />
      </g>
    
      <circle cx="100" cy="60" r="4" fill="gold" />
      <circle cx="60" cy="100" r="4" fill="gold" />
      <circle cx="140" cy="100" r="4" fill="gold" />
      <circle cx="75" cy="140" r="4" fill="gold" />
      <circle cx="125" cy="140" r="4" fill="gold" />
    </svg>
  );
};

export default PlumIcon;
