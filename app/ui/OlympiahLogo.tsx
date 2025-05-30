import React from 'react';

interface OlymipahLogoProps {
  size?: number; //  prop to control size (width & height)
  alt?: string;  //  alt text for accessibility
  className?: string; //  class for additional styling
}

const OlymipahLogo: React.FC<OlymipahLogoProps> = ({ 
  size = 50, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alt = 'logo for olympiah', 
  className = '',
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      alt="logo for olympiah"
      src="/images/logo.png" 
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default OlymipahLogo;
     

