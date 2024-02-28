import Icon from '@ant-design/icons/lib/components/Icon';
import './WorkUnitComponent.css';
import { EyeOutlined, EyeInvisibleOutlined, SettingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';;

function WorkUnitComponent({ workUnit, unitVisibility, notifyUpdateVisibility }) {

  const navigate = useNavigate();
  const componentRef = useRef(null);
  const [containerExpanded, setContainerExpanded] = useState(false);
  const [visibility, setVisibility] = useState(unitVisibility);
  const [colors, setColors] = useState(visibility ? workUnit.colors.visible : workUnit.colors.invisible);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setColors(visibility ? workUnit.colors.visible : workUnit.colors.invisible);
    setCurrentPath(window.location.pathname);
  }, [visibility]);

  const changeVisibility = () => {
    notifyUpdateVisibility(workUnit.id, !visibility);
    setVisibility(!visibility);
  }

  const iconEnter = () => (
    <svg width="1em" height="1em" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9182 2.22925H18.9454C23.3938 2.22925 27 4.66685 27 7.67378V21.2851C27 24.292 23.3938 26.7297 18.9454 26.7297H14.9182" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14.4794H18.9455M18.9455 14.4794L12.9045 10.396M18.9455 14.4794L12.9045 18.5628" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const handleNavigateToWorkUnit = () => {
    sessionStorage.setItem('colors', JSON.stringify(colors));
    const newPath = currentPath.replace('/units', `/unit/${workUnit.id}/${workUnit.name}`);
    console.log(newPath);
    navigate(newPath);
  }

  const showFirstLine = () => (
    <div className="work-unit-component-selection-first-line">
      <Icon
        component={iconEnter}
        className='work-unit-component-icon enter'
        onClick={() => handleNavigateToWorkUnit()}
      />
      <span>{workUnit.name}</span>
      <Icon
        component={visibility ? EyeOutlined : EyeInvisibleOutlined}
        className='work-unit-component-icon visibility'
        onClick={() => changeVisibility()}
      />
    </div>
  )

  return (
    <div
      className='work-unit-component-selection'
      style={{ background: colors.primaryColor }}
      ref={componentRef}
    >
      {showFirstLine()}
    </div>
  )

}

export default WorkUnitComponent;

