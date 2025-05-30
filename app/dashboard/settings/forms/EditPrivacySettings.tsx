import ToggleButton from "@/app/components/Buttons/ToggleButton";
import BlockUserModal from "@/app/components/Modals/BlockUserModal";
import VisibilityDropDown from "@/app/components/VisibilityDropDown";
import { Visibility } from "@/app/models/enums/Visibility";
import useBlockStore from "@/app/store/useBlockStore";
import useSettingStore from "@/app/store/useSettingStore";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type EditPrivacySettingsProps = {
  userId: string;
}

const EditPrivacySettings: React.FC<EditPrivacySettingsProps> = ({ userId }) => {

  const { blockList, deleteFromBlockList } = useBlockStore();
  const { privacySettings, loading, resetSettings, updateSettings } = useSettingStore();

  // Modal state
  const [isViewingBlockModal, setIsViewingBlockModal] = useState(false);

  // Toggle states
  const [canBeFollowed, setCanBeFollowed] = useState(privacySettings?.canBeFollowed);
  const [requireFriendRequests, setRequireFriendRequests] = useState(privacySettings?.requireFriendRequests);
  const [onlineVisibility, setOnlineVisibility] = useState<Visibility | ''>('');
  const [locationVisibility, setLocationVisibility] = useState<Visibility | ''>('');
  const [pageVisibility, setPageVisibility] = useState<Visibility | ''>('');
  const [postVisibility, setPostVisibility] = useState<Visibility | ''>('');
  const [friendVisibility, setFriendVisibility] = useState<Visibility | ''>('');
  const [followingVisibility, setFollowingVisibility] = useState<Visibility | ''>('');

  useEffect(() => {
    if(privacySettings) {
      setCanBeFollowed(privacySettings?.canBeFollowed);
      setRequireFriendRequests(privacySettings?.requireFriendRequests);
      setOnlineVisibility(privacySettings?.onlineVisibility);
      setLocationVisibility(privacySettings?.locationVisibility);
      setPageVisibility(privacySettings?.pageVisibility);
      setPostVisibility(privacySettings?.postVisibility);
      setFriendVisibility(privacySettings?.friendVisibility);
      setFollowingVisibility(privacySettings?.followingVisibility);
    }
  }, [privacySettings]);

  const openBlockModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsViewingBlockModal(true);
  }

  const handleRemove = async (event: React.MouseEvent<HTMLButtonElement>, blockedMember: string) => {
    event.preventDefault();
    deleteFromBlockList(userId, blockedMember);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newPrivacySettings = {
      canBeFollowed,
      requireFriendRequests,
      onlineVisibility,
      locationVisibility,
      pageVisibility,
      postVisibility,
      friendVisibility,
      followingVisibility
    }

    await updateSettings(userId, 2, newPrivacySettings);
  }
  
  return (

    
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg p-10">
      <BlockUserModal
        isVisible={isViewingBlockModal}
        onClose={() => setIsViewingBlockModal(false)}
      />
      {
        loading ? (
          // Spinner
          <div className="flex justify-center items-center">
            <div className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">Restrictions</h1>
            <div className="flex items-center justify-between">
              <label>Can be Followed: </label>
              <ToggleButton label='2FAToggle' isToggled={canBeFollowed!} setIsToggled={setCanBeFollowed}/>
            </div>

            <div className="flex items-center justify-between">
              <label>Require Friend Requests: </label>
              <ToggleButton label='marketPlaceToggle' isToggled={requireFriendRequests!} setIsToggled={setRequireFriendRequests}/>
            </div>

            <hr/>

            <h1 className="text-2xl font-bold">Visibility</h1>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Online Visibility </label>
              <VisibilityDropDown dropdownId="onlineVisibility" defaultValue={onlineVisibility!} setVisibilityState={setOnlineVisibility}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Location Visibility </label>
              <VisibilityDropDown dropdownId="locationVisibility" defaultValue={locationVisibility!} setVisibilityState={setLocationVisibility}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Page Visibility </label>
              <VisibilityDropDown dropdownId="pageVisibility" defaultValue={pageVisibility!} setVisibilityState={setPageVisibility}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Post Visibility </label>
              <VisibilityDropDown dropdownId="postVisibility" defaultValue={postVisibility!} setVisibilityState={setPostVisibility}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Friend Visibility </label>
              <VisibilityDropDown dropdownId="friendVisibility" defaultValue={friendVisibility!} setVisibilityState={setFriendVisibility}/>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="gender"> Following Visibility </label>
              <VisibilityDropDown dropdownId="followingVisibility" defaultValue={followingVisibility!} setVisibilityState={setFollowingVisibility}/>
            </div>

            <br/>
            <hr/>

            <div className="flex items-center justify-between space-x-5">
              <h1 className="text-2xl font-bold">Block List</h1>
              <button onClick={(event) => openBlockModal(event)}>
                <Plus/>
              </button>
            </div>

            <div className="flex items-center justify-between space-x-5">

              {
                blockList.length === 0 ? (
                  <label>No Blocked Users</label>
                ) : (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Members</th>
                        <th scope="col" className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockList.map((blockedUser) => (
                        <tr key={blockedUser._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-600 rounded transition duration-300">
                          <td className="px-6 py-4">
                            <Link href={`/members/${blockedUser.blockedMember.username}`}>
                              <div className="flex gap-4 items-center">

                                <div className="avatar">
                                  <div className="w-12 rounded-full">
                                    <img src={blockedUser.blockedMember.avatar_image} alt={blockedUser.blockedMember.username}/>
                                  </div>
                                </div>

                                <div>
                                  {blockedUser.blockedMember.username}
                                </div>
                              </div>  
                            </Link>     
                          </td>

                          <td className="px-6 py-4">
                            <button className="text-red-500 hover:underline" onClick={(event) => handleRemove(event, blockedUser.blockedMember._id)}>Remove</button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                )
              }
            </div>

            <br/>
      
            <div>
              <button type="button" className="mx-auto bg-gray-200 text-black p-2 rounded mr-2" onClick={() => resetSettings(userId, 2)}>
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

export default EditPrivacySettings;