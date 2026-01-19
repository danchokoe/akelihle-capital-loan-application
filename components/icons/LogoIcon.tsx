import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="https://akelihlecap.co.za/wp-content/uploads/2025/06/Akhelihle-capital-logo-removebg-preview.png" 
    alt="Akelihle Capital Logo" 
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default LogoIcon;