import ToggleButton from "@/app/components/Buttons/ToggleButton";
import { Frequency } from "@/app/models/enums/Frequency";
import useSettingStore from "@/app/store/useSettingStore";
import { useEffect, useState } from "react";

type EditGeneralSettingsProps = {
  userId: string;
}

export default function EditPreferences({ userId }: EditGeneralSettingsProps) {

  const { userPreferences, loading, resetSettings, updateSettings } = useSettingStore();

  // Toggle states
  const [enableInApp, setInApp] = useState(userPreferences?.notifications.inApp);
  const [enableEmail, setEmail] = useState(userPreferences?.notifications.email);
  const [enablePush, setPush] = useState(userPreferences?.notifications.push);
  const [enableSMS, setSMS] = useState(userPreferences?.notifications.sms);
  const [frequency, setFrequency] = useState<string>('');
  
  useEffect(() => {
    if (userPreferences) {
      setInApp(userPreferences?.notifications.inApp);
      setEmail(userPreferences?.notifications.email);
      setPush(userPreferences?.notifications.push);
      setSMS(userPreferences?.notifications.sms);
      setFrequency(userPreferences.notifications.frequency);
    }
  }, [userPreferences]);
  
  const handleFrequencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newPreferences = {
      notifications: {
        inApp: enableInApp,
        email: enableEmail,
        push: enablePush,
        sms: enableSMS,
        frequency
      }
    };

    await updateSettings(userId, 1, newPreferences);
  }

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg p-10">

      { loading ? (
        // Spinner
        <div className="flex justify-center items-center">
          <div className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12"></div>
        </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div className="flex items-center justify-between">
              <label>In App: </label>
              <ToggleButton label='2FAToggle' isToggled={enableInApp!} setIsToggled={setInApp}/>
            </div>

            <div className="flex items-center justify-between">
              <label>Email: </label>
              <ToggleButton label='marketPlaceToggle' isToggled={enableEmail!} setIsToggled={setEmail}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Push: </label>
              <ToggleButton label='darkModeToggle' isToggled={enablePush!} setIsToggled={setPush}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> SMS: </label>
              <ToggleButton label='darkModeToggle' isToggled={enableSMS!} setIsToggled={setSMS}/>
            </div>

            <div className="flex items-center justify-between space-x-5">
              <label>Frequency: </label>
                <select
                  id="frequency"
                  value={frequency}
                  className={`block w-500 bg-gray-100 dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-500 dark:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
                  onChange={handleFrequencyChange}
                >
                  {Object.values(Frequency).map((option) => {
                    return (
                      <option key={option} value={option}>{option}</option>
                    );
                  })}
                </select>
            </div>
            
            {/* <hr/>

            <h1 className="text-2xl font-bold">Muted Notifications</h1>

            <div>
              <label>TODO: List of muted notifications for chats, pages, follows, etc.</label>
            </div> */}

            <br/>
      
            <div>
              <button type="button" className="mx-auto bg-gray-200 text-black p-2 rounded mr-2" onClick={() => resetSettings(userId, 1)}>
                Reset
              </button>

              <button type="submit" className="bg-purple-400 text-black font-bold p-2 rounded hover:bg-purple-500 transition">
                Save
              </button>
            </div>
          </form>
        )
      }
    </div>
  );
}