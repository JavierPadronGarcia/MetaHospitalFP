import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import './ArrowToggle.css';

const ArrowToggle = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle(newExpanded);
  }

  return (
    <div className="arrow-toggle" onClick={toggle}>
      {isExpanded ? <UpOutlined /> : <DownOutlined />}
    </div>
  );
}

export default ArrowToggle;