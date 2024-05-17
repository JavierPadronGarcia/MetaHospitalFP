import { useEffect, useState } from "react";
import ArrowToggle from "../arrowToggle/ArrowToggle";
import "./Accordion.css";

const Accordion = ({ title, children, customClass }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-container ${customClass ?? ""}`}>
      <div className="accordion-title">
        <div className="accordion-title-text">
          {title}
        </div>
        <div className="accordion-title-icon" >
          <ArrowToggle onToggle={setIsOpen} onClick={() => setIsOpen(() => !isOpen)} />
        </div>
      </div>
      <div className="accordion-content">
        {isOpen && children}
      </div>
    </div>
  )

}

export default Accordion;