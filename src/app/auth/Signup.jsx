import { CREATE_SIGNUP } from "@/api";
import apiClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/json/logo";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import companyname from "../../json/company.json";
import AnimatedBackgroundLines from "@/components/common/AnimatedBackgroundLines";
import { AnimatedBackgroundBubble } from "@/components/common/AnimatedBackgroundBubble";
import StockIllustrationCycle from "@/components/common/stock-illustration.";

function Signup() {
  const [formData, setFormData] = useState({
    branch_name: "",
    branch_contact_name: "",
    branch_whatsapp: "",
    branch_prefix: "",
    branch_email: "",
    branch_d_unit: "No",
    branch_s_unit: "No"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const loadingMessages = [
    "Creating your account...",
    "Setting up your free trial...",
    "Almost ready...",
    "Preparing your workspace...",
  ];

  useEffect(() => {
    let index = 0;
    let intervalId;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      intervalId = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 1000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isLoading]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitChange = (unitType) => {
    if (unitType === "both") {
      setFormData(prev => ({
        ...prev,
        branch_d_unit: "Yes",
        branch_s_unit: "Yes"
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        branch_d_unit: unitType === "d_unit" ? "Yes" : "No",
        branch_s_unit: unitType === "s_unit" ? "Yes" : "No"
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate that at least one unit type is selected
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
      const res = await apiClient.post(CREATE_SIGNUP, formData);
      if (res.status === 200 || res.status === 201) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Your 15-day free trial has been activated! Check your email for details.",
        });
    
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Signup Failed: Unexpected response.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description:
          error.response?.data?.message || "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
      <motion.div
        className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full bg-white relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="hidden md:flex flex-col items-center justify-center p-6 w-1/2 bg-yellow-100">
          <div className="flex justify-center items-center">
            <StockIllustrationCycle className="w-96 h-64" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <h3 className="text-2xl font-bold text-yellow-900">15-Day Free Trial</h3>
            <p className="text-yellow-800 mt-2">Get full access to all features</p>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-lg md:text-xl text-gray-700 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5,
                          ease: "easeInOut",
                        }}
                      >
                        <Logo className="w-12 h-12" />
                      </motion.div>

                      <h1 className="text-2xl md:text-3xl ml-4 font-bold text-yellow-900">
                        {companyname?.CompanyName}
                      </h1>
                    </div>
                    <div className="flex justify-end mt-2">
                      <span className="font-semibold text-yellow-800 text-sm">
                        Start your free trial
                      </span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="company" className="text-yellow-900">
                      Company Name *
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      autoFocus
                      placeholder="Enter your company name"
                      value={formData.branch_name}
                      onChange={(e) => handleInputChange("branch_name", e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_name" className="text-yellow-900">
                      Contact Person Name *
                    </Label>
                    <Input
                      id="contact_name"
                      type="text"
                      placeholder="Enter contact person name"
                      value={formData.branch_contact_name}
                      onChange={(e) => handleInputChange("branch_contact_name", e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-yellow-900">
                      WhatsApp Number *
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="Enter your WhatsApp number"
                      value={formData.branch_whatsapp}
                      onChange={(e) => handleInputChange("branch_whatsapp", e.target.value)}
                      required
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab"
                        ];
                    
                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength='10'
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortname" className="text-yellow-900">
                      Company Short Name *
                    </Label>
                    <Input
                      id="shortname"
                      type="text"
                      placeholder="Enter short name for your company"
                      value={formData.branch_prefix}
                      onChange={(e) => handleInputChange("branch_prefix", e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-yellow-900">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.branch_email}
                      onChange={(e) => handleInputChange("branch_email", e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-yellow-900">Unit Type *</Label>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="box"
                          name="unitType"
                          checked={formData.branch_d_unit === "Yes" && formData.branch_s_unit === "No"}
                          onChange={() => handleUnitChange("d_unit")}
                          className="w-4 h-4 text-yellow-600"
                        />
                        <Label htmlFor="box" className="text-yellow-900 cursor-pointer">
                          Box only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="piece"
                          name="unitType"
                          checked={formData.branch_s_unit === "Yes" && formData.branch_d_unit === "No"}
                          onChange={() => handleUnitChange("s_unit")}
                          className="w-4 h-4 text-yellow-600"
                        />
                        <Label htmlFor="piece" className="text-yellow-900 cursor-pointer">
                          Piece only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="both"
                          name="unitType"
                          checked={formData.branch_d_unit === "Yes" && formData.branch_s_unit === "Yes"}
                          onChange={() => handleUnitChange("both")}
                          className="w-4 h-4 text-yellow-600"
                        />
                        <Label htmlFor="both" className="text-yellow-900 cursor-pointer">
                          Both (Box and Piece)
                        </Label>
                      </div>
                    </div>
                    <CardDescription className="text-yellow-800">
                      Select how you want to maintain your stock in quantity 
                    </CardDescription>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          key={loadingMessage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm"
                        >
                          {loadingMessage}
                        </motion.span>
                      ) : (
                        "Start Free Trial"
                      )}
                    </Button>
                  </motion.div>

                  <CardDescription className="flex justify-center mt-2">
                    <span
                      onClick={() => navigate("/")}
                      className="text-yellow-800 underline cursor-pointer"
                    >
                      Already have an account? Sign in
                    </span>
                  </CardDescription>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;