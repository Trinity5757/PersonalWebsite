import React from "react";
import { useState } from "react";
// Define the IconButtonProps interface
interface IconButtonProps {
  icon: React.ReactNode; //icon - maybe add urls for images later
  label?: string; // Very Important - but optional label for accessibility
  text?: string;
  tooltip?: string;
  onClick: () => void; //  handler
  className?: string; // Additional classes for styling
}


const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  label,
  onClick,
  tooltip,
  className = "",
}) => {

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center">
    <button
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`flex items-center justify-center p-2 rounded-full text-white hover:text-gray-600 transition-colors duration-300 ${className}`}
      aria-label={label} 
      title={label} 
    >
       {icon && <span className="mr-2">{icon}</span>}
      {text && <span className="mr-2">{text}</span>}
    </button>


      {showTooltip && tooltip && (
        <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 opacity-80 rounded shadow-lg"
      >
        {tooltip}
      </div>
      )}
     </div>
  );
};

export default IconButton;
