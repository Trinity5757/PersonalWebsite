// app/store/useSettingStore.ts

import { create } from "zustand";
import { IGeneralSettings } from "../models/SettingModels/GeneralSettings";
import { IPrivacySettings } from "../models/SettingModels/PrivacySettings";
import { IUserPreferences } from "../models/SettingModels/UserPreferences";
import axios from "axios";

interface SettingState {
  generalSettings: IGeneralSettings | null;
  privacySettings: IPrivacySettings | null;
  userPreferences: IUserPreferences | null;
  error: string | null;
  loading: boolean;
  fetchAllSettings: (userId: string) => Promise<void>;
  updateSettings: (userId: string, settingType: number, updatedData: Partial<Document>) => Promise<void>;
  resetSettings: (userId: string, settingType?: number) => Promise<void>;
}

const useSettingStore = create<SettingState> ((set) => ({
  generalSettings: null,
  privacySettings: null,
  userPreferences: null,
  error: null,
  loading: false,
  fetchAllSettings: async (userId: string) => {
    set({ loading: true });

    await axios.get(`/api/settings/${userId}`)
      .then((response) => {
        const gset: IGeneralSettings = response.data.generalSettings
        set({ 
          generalSettings: gset,
          privacySettings: response.data.privacySettings,
          userPreferences: response.data.userPreferences,
          error: null, 
          loading: false
        });
      })
      .catch((error) => {
        set({ 
          generalSettings: null,
          privacySettings: null,
          userPreferences: null,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          loading: false
        });
      });
  },
  updateSettings: async (userId: string, settingType: number, updatedData: Partial<Document>) => {
    set({ loading: true });

    await axios.put(`/api/settings/${userId}/?type=${settingType}`, updatedData)
      .then((response) => {
        switch(settingType) {
          case 0:
            set({ generalSettings: response.data });
          case 1:
            set({ userPreferences: response.data });
          case 2:
            set({ privacySettings: response.data });
        }
        set({ error: null, loading: false})
      })
      .catch((error) => {
          set({
            generalSettings: null,
            privacySettings: null,
            userPreferences: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            loading: false
          });
      });
  },
  resetSettings: async (userId: string, settingType?: number) => {
    set({ loading: true});

    let queryParam = '';
    if(settingType) {
      queryParam = `?type=${settingType}`;
    }

    await axios.put(`/api/settings/${userId}/reset/${queryParam}`)
    .then((response) => {
      if(settingType) {
        switch(settingType) {
          case 0:
            set({ generalSettings: response.data });
          case 1:
            set({ userPreferences: response.data });
          case 2:
            set({ privacySettings: response.data });
        }
      } else {
        set({
          generalSettings: response.data.defaultGeneralSettings,
          userPreferences: response.data.defaultUserPreferences,
          privacySettings: response.data.defaultPrivacySettings
        })
      }
      
      set({ error: null, loading: false})
    })
    .catch((error) => {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false
      })
    });
  } 
}));

export default useSettingStore;