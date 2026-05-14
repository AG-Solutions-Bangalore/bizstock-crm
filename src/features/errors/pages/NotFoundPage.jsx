import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-yellow-500">404</h1>
        <h2 className="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/home")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-6 text-lg rounded-xl transition-all shadow-lg hover:shadow-yellow-200"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
