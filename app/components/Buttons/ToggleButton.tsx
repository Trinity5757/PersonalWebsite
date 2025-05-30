
type ToggleButtonProps = {
  label: string;
  isToggled: boolean;
  setIsToggled: (value: boolean) => void
}

export default function ToggleButton({ label, isToggled, setIsToggled }: ToggleButtonProps) {
  // Styles
  const buttonStyles = {
    width: '60px',
    height: '30px',
    backgroundColor: isToggled ? '#C084FB' : '#ccc',
    borderRadius: '15px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const circleStyles = {
    width: '28px',
    height: '28px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '1px',
    left: isToggled ? '31px' : '1px',
    transition: 'left 0.3s'
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div id={label} style={{ display: 'inline-block' }} onClick={handleToggle}>
      <div style={buttonStyles}>
        <div style={circleStyles}></div>
      </div>
    </div>
  );
}