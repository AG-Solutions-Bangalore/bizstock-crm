import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { signupUser } from "../services/authService";
import { INITIAL_SIGNUP_DATA, LOADING_MESSAGES } from "../form/authConstants";

export const useSignup = () => {
  const [formData, setFormData] = useState(INITIAL_SIGNUP_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    let intervalId;
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      intervalId = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 1000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isLoading]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUnitChange = (unitType) => {
    if (unitType === "both") {
      setFormData((prev) => ({
        ...prev,
        branch_d_unit: "Yes",
        branch_s_unit: "Yes",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        branch_d_unit: unitType === "d_unit" ? "Yes" : "No",
        branch_s_unit: unitType === "s_unit" ? "Yes" : "No",
      }));
    }
  };

  const handleBatchToggle = () => {
    setFormData((prev) => ({
      ...prev,
      branch_batch: prev.branch_batch === "Yes" ? "No" : "Yes",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.branch_d_unit === "No" && formData.branch_s_unit === "No") {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select at least one unit type.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await signupUser(formData);
      if (res.status === 200 || res.status === 201) {
        toast({
          variant: "default",
          title: "Success!",
          description:
            "Your 15-day free trial has been activated! Check your email for details.",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "Unexpected response from server.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description:
          error.response?.data?.message ||
          "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    loadingMessage,
    handleInputChange,
    handleUnitChange,
    handleBatchToggle,
    handleSubmit,
  };
};
