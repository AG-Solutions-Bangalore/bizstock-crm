import { motion } from "framer-motion";
import StockIllustrationCycle from "@/components/common/stock-illustration.";

const SignupIllustration = () => {
  return (
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
  );
};

export default SignupIllustration;
