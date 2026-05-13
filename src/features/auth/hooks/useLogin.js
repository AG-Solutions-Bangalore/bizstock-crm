import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginSuccess } from "@/redux/authSlice";
import { loginUser } from "../services/authService";
import { LOADING_MESSAGES } from "../form/authConstants";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const { toast } = useToast();
  const dispatch = useDispatch();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.status === 200 && res.data.UserInfo?.token) {
        const { UserInfo } = res.data;
        const userData = {
          token: UserInfo.token,
          id: UserInfo.user.id,
          name: UserInfo.user?.name,
          user_type: UserInfo.user?.user_type,
          email: UserInfo.user.email,
          token_expire_time: UserInfo.token_expires_at,
          whatsapp_number: res?.data?.branch?.branch_whatsapp,
          version: res?.data?.version?.version_panel,
          branch_d_unit: res?.data?.branch?.branch_d_unit,
          branch_s_unit: res?.data?.branch?.branch_s_unit,
          branch_batch: res?.data?.branch?.branch_batch,
        };
        dispatch(loginSuccess(userData));
        navigate(window.innerWidth < 768 ? "/home" : "/stock-view");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Unexpected response from server.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error?.response?.data?.error || "Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loadingMessage,
    handleSubmit,
  };
};
