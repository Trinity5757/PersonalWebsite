// app/store/useBuisnessStore.ts

import { create } from 'zustand';
import axios from 'axios';
import { ITeam } from '../models/Team';


// axios for clinet side
interface TeamState {
  team: ITeam | null;
  teams: ITeam[];
  error: string | null;
  loading: boolean; 
  createTeam: (team: ITeam) => Promise<ITeam>;
  fetchTeam: (id: string) => Promise<ITeam>; // get team ID
  updateTeam: (id: string, updatedData: Partial<ITeam>) =>  Promise<ITeam>; // get tean ID to update user
  deleteTeam: (id: string) => Promise<void>; // get team ID to delete user
  fetchAllTeams: () => Promise<ITeam[]>;
  setTeams: (temas: ITeam[]) => void;
  addTeam: (team: ITeam) => void;

}

const useTeamStore = create<TeamState>((set) => ({
  team: null,
  teams: [], // Initial empty list of teams
  error: null,
  loading: false, // Initial loading state

  createTeam: async (data: ITeam) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/api/teams`, data);
      const createdTeam: ITeam = await response.data;

      const teamId = createdTeam._id;
    if (!teamId || (typeof teamId !== 'string' && typeof teamId !== 'number')) {
      throw new Error('Invalid team _id');
    }
      set((state) => ({
        teams: [createdTeam,...state.teams], // Add the new team to the existing list
        team: createdTeam, // Set the newly created team as the selected one, if needed
        error: null,
        loading: false,
      }));


     
      console.log("Success fully created team data in the team store");
      return createdTeam;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the team store in createTeam");
      throw err;
    }
  },
  fetchTeam: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/teams/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch team data');
      }

      const data: ITeam = await response.data;
      set({ team: data, error: null, loading: false }); // Set the team data and clear any error
      console.log("Success fully fetched data in the team store");
      return data;
    } catch (err) {
      set({ team: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the team store in fetchTeam");
      return Promise.reject(err);

    }
  },

  // Fetch all teams - to do pagination
  fetchAllTeams: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/teams`); 
  
      const data: ITeam[] = await response.data;

      console.log(data, "Successfully fetched data in the team store");
      if (Array.isArray(data)) {
        set((state) => {
          // Merge fetched teams with existing teams, avoiding duplicates
          const mergedTeams = [
            ...state.teams,
            ...data.filter(
              (newTeam) => !state.teams.some((team) => team._id === newTeam._id)
            ),
          ];
          return { teams: mergedTeams, error: null, loading: false };
        });
     
      } else {
        set({ teams: [], error: 'Failed to fetch teams: Invalid data format', loading: false });
      }
      console.log("Successfully fetched data in the team store");

      return data;
     
    } catch (err) {
      set({ teams: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the team store in fetchAllTeams");
      return Promise.reject(err);
     
    }
  },
  updateTeam: async (id, updatedData: Partial<ITeam> ): Promise<ITeam> => {
    set({ loading: true, error: null });
  
    try {
      
      const res = await axios.put(`/api/teams/${id}`, updatedData); // modify for dyanimic routes over query params
      // better for SEO, cleaner here but not for dyanmic  routes since we will need toget the id from the query params
  
      const updatedTeam: ITeam = res.data;

      // Update the state with the new team data, and mark loading as false
      set((state) => {
        const updatedTeams = state.teams.map((team) =>
          team._id === id ? { ...team, ...updatedData } : team
        );
        return {
          teams: updatedTeams,
          team: state.team?._id === id ? updatedTeam : state.team,
          error: null,
          loading: false,
        };
      });
     
  
      console.log("updatedTeams in the team store");
      return updatedTeam;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the team store in updateTeam");

      throw err;
    }
  },
  deleteTeam: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`/api/teams/${id}`);

      set((state) => ({
        team: state.team?._id === id ? null : state.team,
        teams: state.teams.filter((team) => team._id !== id), // take team to detelet from list
        error: null,
        loading: false,
      }));

      console.log("Success fully deleted team data in the team store");

     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the team store in deleteTeam");
      
    }
  },

  setTeams: (teams) => set({ teams }),

  addTeam: (team: ITeam) => set((state) => {
  
    // Check if the team already exists
    const teamExists = state.teams.some((existingTeam) => existingTeam._id === team._id);
    if (teamExists) { // no need to add team
      return state; 
    }

 
    // Add the new team if it doesn't exist
    return { teams: [team, ...state.teams] };
  }),
  


}));

export default useTeamStore;
