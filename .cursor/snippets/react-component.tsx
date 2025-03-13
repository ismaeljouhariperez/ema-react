// React Component Template
// Usage: Type 'react-component' and press Tab
import React from "react";

interface ComponentNameProps {
  prop: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ prop }) => {
  return <div>{prop}</div>;
};

export default ComponentName;
