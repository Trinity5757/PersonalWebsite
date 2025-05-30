import { ReactNode } from 'react';
import { Plus } from "lucide-react"
import { RiUserFollowLine, RiMailAddLine } from "react-icons/ri";
import { AiOutlineInfoCircle, AiOutlineHeart, AiOutlineHome } from "react-icons/ai";
import { IoPeopleCircleSharp, IoNotificationsOutline } from "react-icons/io5";
import { IoIosFootball, IoIosPersonAdd } from "react-icons/io";
import { HiOutlinePhotograph, HiOutlineUsers } from "react-icons/hi";
import { MdOutlineVideoLibrary, MdSpaceDashboard, MdAdminPanelSettings, MdOutlineTimeline, MdSettings } from "react-icons/md";
import { BiAlbum, BiUserCheck, BiAt } from "react-icons/bi";
import { FaBook, FaRegCalendarAlt, FaHandsHelping } from "react-icons/fa";
import { BsPlayBtn, BsCart, BsArchive } from "react-icons/bs";
import { FiMail, FiUserPlus, FiInbox, FiSend, FiUserCheck, FiUser, FiUsers, FiSettings } from "react-icons/fi";
import { TbUsersGroup } from "react-icons/tb";
import { MdDynamicFeed } from "react-icons/md"
import { BsGrid } from "react-icons/bs"

export interface SidebarItem {
  name: string; // Resolved dynamically outside client components
  path: string;
  isDynamic?: boolean; // Indicates session-based dynamic item
  icon?: ReactNode; // Optional icon
}

export interface SidebarConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title?: string | ((session?: any) => string);
  items?: SidebarItem[]; // Make items optional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawItems?: (session?: any) => SidebarItem[]; // Allow rawItems
  footer?: {
    type: 'logout' | 'custom';
  } | null;
  categories?: string[];
}

export const rawSidebars: Record<string, SidebarConfig> = {
  dashboard: {
    title: "Dashboard",
    rawItems: (session) => [
      {
        name: session?.user?.first_name || "Guest",
        path: "/dashboard/admin",
        isDynamic: true,
        icon: <FiUserCheck />,
      },
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
      { name: "Members", path: "/dashboard/members", icon: <FiUsers /> },
    ],
    footer: {
      type: "logout",
    },
  },
  dropdown: {
    title: (session) => `Welcome, ${session?.user?.first_name}!` || "Welcome, Guest!",
    rawItems: (session) => [
      {
        name: "Profile",
        path: session?.user ? `/members/${session.user.username || session.user.id}` : "/members",
        isDynamic: true,
        icon: <FiUser />,
      },
      { name: "Settings", path: "/dashboard/settings", icon: <MdSettings /> },
      { name: "Members", path: "/members", icon: <FiUsers /> },
      { name: "Pages", path: "/pages", icon: <FaBook /> },
      { name: "Teams", path: "/teams", icon: <TbUsersGroup /> },
      { name: "Sports", path: "/sports", icon: <IoIosFootball /> },
      { name: "Events", path: "/events", icon: <FaRegCalendarAlt /> },
      { name: "Watch", path: "/watch", icon: <BsPlayBtn /> },
      { name: "Store", path: "/store", icon: <BsCart /> },
      { name: "Fundraisers", path: "/dashboard/fundraisers", icon: <FaHandsHelping /> },
    ],
    footer: {
      type: "logout",
    },
  },
  create: {
    title: "Create",
    rawItems: () => [
      { name: "Post", path: "/messages/inbox", icon: <Plus /> },
      { name: "Page", path: "/messages/sent", icon: <FaBook /> },
      { name: "Team", path: "/messages/archived", icon: <TbUsersGroup /> },
    ],
    footer: null,
  },
  messages: {
    title: "Messages",
    rawItems: () => [
      { name: "Inbox", path: "/messages/inbox", icon: <FiInbox /> },
      { name: "Sent", path: "/messages/sent", icon: <FiSend /> },
      { name: "Archived", path: "/messages/archived", icon: <BsArchive /> },
      { name: "Compose", path: "/messages/compose", icon: <RiMailAddLine /> },
    ],
    footer: null,
  },
  notifications: {
    title: "Notifications",
    rawItems: () => [
      { name: "All Notifications", path: "/notifications", icon: <IoNotificationsOutline /> },
      { name: "Mentions", path: "/notifications/mentions", icon: <BiAt /> },
      { name: "Activity", path: "/notifications/activity", icon: <MdOutlineTimeline /> },
      { name: "Settings", path: "/notifications/settings", icon: <FiSettings /> },
    ],
    footer: null,
  },
  home: {
    title: "Home",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: <MdSpaceDashboard /> },
      { name: "Feeds", path: "/feeds", icon: <MdDynamicFeed /> },
      { name: "Members", path: "/members", icon: <FiUsers /> },
      { name: "Pages", path: "/pages", icon: <FaBook /> },
      { name: "Teams", path: "/teams", icon: <TbUsersGroup /> },
      { name: "Sports", path: "/sports", icon: <IoIosFootball /> },
      { name: "Events", path: "/events", icon: <FaRegCalendarAlt /> },
      { name: "Watch", path: "/watch", icon: <BsPlayBtn /> },
      { name: "Store", path: "/store", icon: <BsCart /> },
      { name: "Fundraisers", path: "/dashboard/fundraisers", icon: <FaHandsHelping /> },
    ],
    footer: {
      type: "logout",
    },
  },
  feeds: {
    title: "Feeds",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "All", path: "/feeds", icon: <BsGrid /> },
      { name: "Favorites", path: "/feeds/favorites", icon: <AiOutlineHeart /> },
      { name: "Friends", path: "/feeds/friends", icon: <IoPeopleCircleSharp /> },
      { name: "Teams", path: "/feeds/teams", icon: <TbUsersGroup /> },
      { name: "Pages", path: "/feeds/pages", icon: <FaBook /> },
    ],
    footer: {
      type: "logout",
    },
  },
  members: {
    title: "Members",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "Requests", path: "/members/requests", icon: <IoIosPersonAdd /> },
      { name: "Friends", path: "/members/friends", icon: <IoPeopleCircleSharp /> },
      { name: "Following", path: "/members/following", icon: <RiUserFollowLine /> },
    ],
    footer: {
      type: "logout",
    },
  },
  memberProfile: {
    title: "Profile",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "About", path: "/members/about", icon: <AiOutlineInfoCircle /> },
      { name: "Friends", path: "/members/friends", icon: <IoPeopleCircleSharp /> },
      { name: "Photos", path: "/members/profile/photos", icon: <HiOutlinePhotograph /> },
      { name: "Videos", path: "/members/profile/videos", icon: <MdOutlineVideoLibrary /> },
      { name: "Albums", path: "/members/profile/albums", icon: <BiAlbum /> },
      { name: "Teams", path: "/members/profile/teams", icon: <TbUsersGroup /> },
      { name: "Followers", path: "/members/followers", icon: <HiOutlineUsers /> },
      { name: "Following", path: "/members/profile/following", icon: <RiUserFollowLine /> },
    ],
    footer: {
      type: "logout",
    },
  },
  pages: {
    title: "Pages",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "Managing", path: "/pages/managing", icon: <MdAdminPanelSettings /> },
      { name: "Liked", path: "/pages/liked", icon: <AiOutlineHeart /> },
      { name: "Following", path: "/pages/following", icon: <BiUserCheck /> },
      { name: "Invites", path: "/pages/invites", icon: <FiMail /> },
    ],
    footer: {
      type: "logout",
    },
  },
  teams: {
    title: "Teams",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "Managing", path: "/pages/managing", icon: <MdAdminPanelSettings /> },
      { name: "Joined", path: "/pages/joined", icon: <FiUserPlus /> },
      { name: "Following", path: "/pages/following", icon: <BiUserCheck /> },
      { name: "Invites", path: "/pages/invites", icon: <FiMail /> },
    ],
    footer: {
      type: "logout",
    },
    categories: ["Soccer", "Lacrosse", "Basketball", "Volleyball"],
  },
  sports: {
    title: "Sports",
    items: [
      { name: "Home", path: "/home", icon: <AiOutlineHome /> },
      { name: "Managing", path: "/sports/managing", icon: <MdAdminPanelSettings /> },
      { name: "My Sports", path: "/sports/my-sports", icon: <IoIosFootball /> },
      { name: "Following", path: "/sports/following", icon: <BiUserCheck /> },
      { name: "Events", path: "/sports/events", icon: <FaRegCalendarAlt /> },
    ],
    footer: {
      type: "logout",
    },
    categories: [
      "Team Sports",
      "Individual Sports", 
      "Combat Sports",
    ],
  },
};

export const resolveSidebarConfig = (section, session) => {
  const rawConfig = rawSidebars[section];

  if (!rawConfig) {
    throw new Error(`Sidebar configuration not found for section: ${section}`);
  }

  const resolvedItems = rawConfig.rawItems
    ? rawConfig.rawItems(session)
    : rawConfig.items || [];

  // Dynamically resolve the title if it's a function
  const resolvedTitle =
    typeof rawConfig.title === "function"
      ? rawConfig.title(session)
      : rawConfig.title;

  return {
    ...rawConfig,
    title: resolvedTitle,
    items: resolvedItems,
  };
};