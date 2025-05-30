import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      style={{
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#c084fc' : '#e0e0e0',
        color: isActive ? '#fff' : '#000',
        border: 'none',
        outline: 'none',
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Tab;
