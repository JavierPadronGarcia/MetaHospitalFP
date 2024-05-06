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

  const handleNavigateToWorkUnit = () => {
    sessionStorage.setItem('colors', JSON.stringify(colors));
    const newPath = currentPath.replace('/units', `/unit/${workUnit.id}/${workUnit.name}`);
    console.log(newPath);
    navigate(newPath);
  }

  const showFirstLine = () => (
    <div className="work-unit-component-selection-first-line">
      <div
        className='work-unit-component-icon enter'
        onClick={() => handleNavigateToWorkUnit()}
        style={{ background: colors.primaryColor, height: '4rem', width: '4rem', borderRadius: '1rem' }}
      />
      <div style={{ display: 'flex', marginLeft: '1rem', width: '80%', textAlign: 'start', color: '#777777' }} onClick={() => handleNavigateToWorkUnit()}>
        <b style={{ display: 'flex', alignItems: 'center', width: '100%', height: '4rem' }}>{workUnit.name}</b>
      </div>
      <Icon
        component={visibility ? EyeOutlined : EyeInvisibleOutlined}
        className='work-unit-component-icon visibility'
        onClick={() => changeVisibility()}
        style={{ color: '#777777' }}
      />
    </div>
  )

  return (
    <div
      className='work-unit-component-selection'
      style={{ background: 'white' }}
      ref={componentRef}
    >
      {showFirstLine()}
    </div>
  )

}

export default WorkUnitComponent;

