import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "../services/authService";
import { LOADING_MESSAGES } from "../form/authConstants";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { toast } = useToast();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await forgotPassword(email, username);
      if (res.status === 200) {
        const response = res.data;
        if (response.code === 200) {
          toast({
            title: "Success",
            description: response.msg,
          });
        } else {
          toast({
            title: response.code === 400 ? "Duplicate Entry" : "Unexpected Response",
            description: response.msg,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Unexpected response from the server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    username,
    setUserName,
    isLoading,
    loadingMessage,
    handleSubmit,
  };
};
