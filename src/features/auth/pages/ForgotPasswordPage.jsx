import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/json/logo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import companyname from "@/json/company.json";
import AnimatedBackgroundLines from "@/components/common/AnimatedBackgroundLines";
import { AnimatedBackgroundBubble } from "@/components/common/AnimatedBackgroundBubble";
import StockIllustrationCycle from "@/components/common/stock-illustration.";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const {
    email,
    setEmail,
    username,
    setUserName,
    isLoading,
    loadingMessage,
    handleSubmit,
  } = useForgotPassword();
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatedBackgroundLines />
        <AnimatedBackgroundBubble />
      </div>

      <motion.div
        className="flex flex-col md:flex-row hadow-none rounded border border-[#888888] overflow-hidden max-w-5xl w-full bg-white relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="hidden md:flex flex-col items-center justify-center p-6 w-1/2 bg-yellow-100">
          <div className="flex justify-center items-center">
            <StockIllustrationCycle className="w-96 h-64" />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-none">
              <CardHeader className="mb-4">
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
                      Forgot Password
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-yellow-900">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-yellow-900">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 bg-white text-black"
                    />
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
                        "Reset Password"
                      )}
                    </Button>
                  </motion.div>

                  <CardDescription className="text-right mt-2">
                    <span
                      onClick={() => navigate("/")}
                      className="text-yellow-800 underline cursor-pointer"
                    >
                      Sign In
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
