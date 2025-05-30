
// app/dashboard/settings/page.tsx

"use client";

import useSettingStore from "@/app/store/useSettingStore";
import { useSession } from "next-auth/react";
import Tabs from "@/app/components/Tabs/Tabs";
import EditGeneralSettings from "./forms/EditGeneralSettings";
import EditPrivacySettings from "./forms/EditPrivacySettings";
import EditPreferences from "./forms/EditPreferences";
import { useEffect } from "react";
import useBlockStore from "@/app/store/useBlockStore";

export default function SettingsPage() {

  const { data: session } = useSession();
  const user_id = session?.user?.id?.toString();

  const { fetchAllSettings } = useSettingStore();
  const { fetchBlockList } = useBlockStore();
  useEffect(() => {
    if(user_id) {
      fetchAllSettings(user_id).catch((err) => console.error("Error fetching user settings:", err));
      fetchBlockList(user_id);
    }
  }, [user_id, fetchAllSettings, fetchBlockList]);

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div style={{ padding: '20px' }}>
        <Tabs>
          <div id="General">
            <EditGeneralSettings userId={user_id!}/>
          </div>
          <div id="Preferences">
            <EditPreferences userId={user_id!}/>
          </div>
          <div id="Privacy">
            <EditPrivacySettings userId={user_id!}/>
          </div>
        </Tabs>
      </div>
    </div>
  );
}  