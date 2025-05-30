import { Visibility } from "../models/enums/Visibility";

type DropdownProps = {
  dropdownId: string;
  defaultValue: Visibility | '';
  setVisibilityState: (value: Visibility) => void
}

export default function VisibilityDropDown({ dropdownId, defaultValue, setVisibilityState }: DropdownProps) {

  const handleFVisibilityChange = (option: Visibility) => {
    setVisibilityState(option);
  };

  return (
    <select
      id={dropdownId}
      value={defaultValue}
      className={`block w-500 bg-gray-100 dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-500 dark:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
      onChange={(e) => handleFVisibilityChange(e.target.value as Visibility)}
    >
      {Object.values(Visibility).map((option) => {
        return (
          <option key={option} value={option}>{option}</option>
        );
      })}
    </select>
  );
}
