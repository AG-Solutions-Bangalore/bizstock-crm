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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Logo from "@/json/logo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import companyname from "@/json/company.json";
import SignupIllustration from "../components/SignupIllustration";
import { useSignup } from "../hooks/useSignup";

function SignupPage() {
  const {
    formData,
    isLoading,
    loadingMessage,
    handleInputChange,
    handleUnitChange,
    handleBatchToggle,
    handleSubmit,
  } = useSignup();
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
      <motion.div
        className="flex flex-col md:flex-row h-[84vh] shadow-none rounded border border-[#888888]  overflow-hidden max-w-5xl w-full bg-white relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <SignupIllustration />

        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="flex flex-col h-full border-none shadow-none">
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
              <CardContent className="flex-1 overflow-y-auto p-6 md:p-10 !pt-0 custom-scrollbar">
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
                      onChange={(e) =>
                        handleInputChange("branch_name", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("branch_contact_name", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("branch_whatsapp", e.target.value)
                      }
                      required
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ];

                        if (
                          !/[0-9]/.test(e.key) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      maxLength="10"
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
                      onChange={(e) =>
                        handleInputChange("branch_prefix", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("branch_email", e.target.value)
                      }
                      required
                      className="mt-1 bg-white text-black"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-yellow-900">Unit Type *</Label>
                    <RadioGroup
                      value={
                        formData.branch_d_unit === "Yes" && formData.branch_s_unit === "Yes"
                          ? "both"
                          : formData.branch_d_unit === "Yes"
                          ? "d_unit"
                          : "s_unit"
                      }
                      onValueChange={handleUnitChange}
                      className="flex flex-row items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="d_unit" id="box" className="border-yellow-600 text-yellow-600" />
                        <Label htmlFor="box" className="text-yellow-900 cursor-pointer">
                          Box only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="s_unit" id="piece" className="border-yellow-600 text-yellow-600" />
                        <Label htmlFor="piece" className="text-yellow-900 cursor-pointer">
                          Piece only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" className="border-yellow-600 text-yellow-600" />
                        <Label htmlFor="both" className="text-yellow-900 cursor-pointer">
                          Both (Box and Piece)
                        </Label>
                      </div>
                    </RadioGroup>

                    <CardDescription className="text-yellow-800">
                      Select how you want to maintain your stock in quantity
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={handleBatchToggle}
                      className={`
                        w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center
                        transition-all duration-200 shrink-0
                        ${
                          formData.branch_batch === "Yes"
                            ? "bg-yellow-600 border-yellow-600"
                            : "bg-white border-gray-300 hover:border-yellow-500"
                        }
                      `}
                    >
                      {formData.branch_batch === "Yes" && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <Label
                      htmlFor="branch_batch"
                      onClick={handleBatchToggle}
                      className="text-yellow-900 cursor-pointer text-sm font-medium select-none"
                    >
                      Do you have Batch No
                    </Label>
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

export default SignupPage;
