import { useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { changePassword } from "../services/authService";
import { INITIAL_CHANGE_PASSWORD_DATA } from "../form/authConstants";

export const useChangePassword = (setOpen) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const username = useSelector((state) => state.auth.name);
  const token = usetoken();
  const [formData, setFormData] = useState({
    ...INITIAL_CHANGE_PASSWORD_DATA,
    name: username,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.currentPassword) missingFields.push("Current Password");
    if (!formData.newPassword) missingFields.push("New Password");

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(formData, token);
      if (response?.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });
        setFormData({ ...INITIAL_CHANGE_PASSWORD_DATA, name: username });
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};
