import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";

export const useDashboardLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openprofile, setOpenProfile] = useState(false);

  const nameL = useSelector((state) => state?.auth.name);
  const emailL = useSelector((state) => state?.auth.email);
  const id = useSelector((state) => state.auth?.user_type);
  const localVersion = useSelector((state) => state.auth?.version);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleLogout = useLogout();

  // Create initials from user name
  const splitUser = nameL || "";
  const initialsChar = splitUser
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return {
    navigate,
    open,
    setOpen,
    openprofile,
    setOpenProfile,
    nameL,
    emailL,
    id,
    localVersion,
    handleBackClick,
    handleLogout,
    initialsChar,
  };
};
