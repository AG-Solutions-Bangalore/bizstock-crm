import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2, SquarePlus } from "lucide-react";
import { useCategory } from "../../hooks/useCategory";
import { ButtonConfig } from "@/config/ButtonConfig";
import { CATEGORY_IMAGE_URL, NO_IMAGE_URL } from "@/config/BaseUrl";
import { useState, useEffect } from "react";

const CategoryFormDialog = ({ categoryId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  } = useCategory(categoryId);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Reset file selection when dialog closes
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open]);

  const onSubmit = () => {
    const data = new FormData();
    data.append("category", formData.category);
    if (isEditMode) {
      data.append("_method", "PUT");
      data.append("category_status", formData.category_status);
    }
    if (imageFile) {
      data.append("category_image", imageFile);
    } else if (formData.category_image) {
      data.append("category_image", formData.category_image);
    }
    handleSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
            <Edit className="h-4 w-4 text-yellow-700" />
          </Button>
        ) : (
          <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
            <SquarePlus className="h-4 w-4 mr-2" /> Category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {isFetching ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Update Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category Name *</label>
                <Input
                  placeholder="Enter Category Name"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                />
              </div>

              {isEditMode && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select
                    value={formData.category_status}
                    onValueChange={(v) => handleInputChange("category_status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Category Image</label>
                <div className="flex items-start gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImageFile(null);
                        setImagePreview(null);
                      }
                    }}
                    className="flex-1"
                  />
                  <img
                    src={imagePreview || (formData.category_image ? `${CATEGORY_IMAGE_URL}/${formData.category_image}` : NO_IMAGE_URL)}
                    alt="Category Preview"
                    className="h-16 w-16 rounded border object-cover shrink-0"
                    onError={(e) => {
                      e.target.src = NO_IMAGE_URL;
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className={`w-full mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Update" : "Create")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
