import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { CATEGORY_IMAGE_URL, NO_IMAGE_URL } from "@/config/BaseUrl";

const CategoryViewDialog = ({ category }) => {
  if (!category) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
          <Eye className="h-4 w-4 text-yellow-700" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] overflow-hidden">
        <DialogHeader className="border-b pb-3 border-yellow-100">
          <DialogTitle className="text-xl font-bold text-yellow-900">
            Category Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Image Display */}
          <div className="flex justify-center bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
            <img
              src={
                category.category_image
                  ? `${CATEGORY_IMAGE_URL}/${category.category_image}`
                  : NO_IMAGE_URL
              }
              alt={category.category}
              className="h-48 w-48 object-cover rounded-lg shadow-sm border border-white"
              onError={(e) => {
                e.target.src = NO_IMAGE_URL;
              }}
            />
          </div>

          {/* Details list */}
          <div className="grid gap-3 px-1">
            <div className="flex items-center justify-between border-b pb-2 border-yellow-50">
              <span className="text-sm font-medium text-yellow-800/80">
                Category Name
              </span>
              <span className="text-base font-bold text-yellow-905">
                {category.category}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-yellow-50">
              <span className="text-sm font-medium text-yellow-800/80">
                Status
              </span>
              <span className="flex items-center gap-1.5">
                {category.category_status === "Active" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-700">
                      Active
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-500">
                      Inactive
                    </span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-800/80">
                Category ID
              </span>
              <span className="text-sm font-mono text-gray-500">
                #{category.id}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryViewDialog;
