import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "../services/authService";
import { INITIAL_PROFILE_DATA } from "../form/authConstants";

export const useProfile = (open, setOpen) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const token = usetoken();
  const [formData, setFormData] = useState(INITIAL_PROFILE_DATA);

  const { refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const profile = await fetchProfile(token);
      setFormData(profile);
      return profile;
    },
    enabled: false,
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push("Name");
    if (!formData.mobile) missingFields.push("Mobile");
    if (!formData.email) missingFields.push("Email");

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
      const response = await updateProfile(formData, token);
      if (response?.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });
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
        description: error.response?.data?.message || "Failed to update profile",
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
