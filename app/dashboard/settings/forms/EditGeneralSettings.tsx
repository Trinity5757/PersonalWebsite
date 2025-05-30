import ToggleButton from "@/app/components/Buttons/ToggleButton";
import useSettingStore from "@/app/store/useSettingStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type EditGeneralSettingsProps = {
  userId: string;
}

const EditGeneralSettings: React.FC<EditGeneralSettingsProps> = ({ userId }) => {

  const router = useRouter();

  const { generalSettings, loading, resetSettings, updateSettings } = useSettingStore();

  // Toggle states
  const [twoFAToggle, setTwoFAToggle] = useState(generalSettings?.is2FAenabled);
  const [marketPlaceToggle, setMarketPlaceToggle] = useState(generalSettings?.marketplace);
  const [darkModeToggle, setDarkModeToggle] = useState(generalSettings?.darkMode);
  
  useEffect(() => {
    if (generalSettings) {
      setTwoFAToggle(generalSettings.is2FAenabled);
      setMarketPlaceToggle(generalSettings.marketplace);
      setDarkModeToggle(generalSettings.darkMode);
    }
  }, [generalSettings]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newGeneralSettings = {
      is2FAenabled: twoFAToggle,
      marketplace: marketPlaceToggle,
      darkMode: darkModeToggle
    };

    await updateSettings(userId, 0, newGeneralSettings);
  }

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg p-10">
      {loading ? (
        // Spinner
        <div className="flex justify-center items-center">
          <div className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">

          <h1 className="text-2xl font-bold">General Settings</h1>
          
          <div className="flex items-center justify-between">
            <label>2 Factor Authentication: </label>
            <ToggleButton label='2FAToggle' isToggled={twoFAToggle!} setIsToggled={setTwoFAToggle}/>
          </div>

          <div className="flex items-center justify-between">
            <label>Marketplace: </label>
            <ToggleButton label='marketPlaceToggle' isToggled={marketPlaceToggle!} setIsToggled={setMarketPlaceToggle}/>
          </div>

          <div className="flex items-center justify-between space-x-5">
            <label>Languages: </label>
            <select
              name="language"
              id="language"
              className={`block w-500 bg-gray-100 dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-500 dark:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
            >
              <option key="" value="">Select your language</option>
              <option key="english" value="english">English</option>
              <option key="spanish" value="spanish">Spanish</option>
              <option key="french" value="french">French</option>
            </select>
          </div>


          <div className="flex items-center justify-between">
            <label htmlFor="gender"> Dark Mode </label>
            <ToggleButton label='darkModeToggle' isToggled={darkModeToggle!} setIsToggled={setDarkModeToggle}/>
          </div>

          <br/>

          <div>
            <button 
              type="button" 
              className="mx-auto bg-yellow-400 text-black p-2 rounded mr-2 hover:bg-yellow-500 transition" 
              onClick={() => router.push('/reset-password')}
            >
              Reset Password
            </button>
          </div>
    
          <div>
            <button type="button" className="mx-auto bg-red-400 text-black p-2 rounded mr-2" onClick={() => resetSettings(userId)}>
              Restore All Settings
            </button>

            <button type="button" className="mx-auto bg-gray-200 text-black p-2 rounded mr-2" onClick={() => resetSettings(userId, 0)}>
              Reset
            </button>

            <button type="submit" className="bg-purple-400 text-black font-bold p-2 rounded hover:bg-purple-500 transition">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditGeneralSettings;