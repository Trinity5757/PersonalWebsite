import React, { useState, ReactElement } from 'react';
import Tab from './Tab';

interface TabsProps {
  children: ReactElement<{ id: string }>[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {React.Children.map(children, (child, index) => (
          <Tab
            label={child.props.id}
            isActive={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      {React.Children.map(children, (child, index) =>
        index === activeIndex ? child : null
      )}
    </div>
  );
};

export default Tabs;
