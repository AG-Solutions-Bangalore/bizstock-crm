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
import { IMAGE_URL, NO_IMAGE_URL } from "@/config/BaseUrl";

import { Edit, Loader2, SquarePlus } from "lucide-react";
import { useItem } from "../../hooks/useItem";
import { useCategory } from "../../hooks/useCategory";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ItemFormDialog = ({ itemId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  } = useItem(itemId);
  const { toast } = useToast();

  const { useCategoriesQuery } = useCategory();
  const { data: categories } = useCategoriesQuery();
  const branchUnit = useSelector((state) => state.auth.branch_d_unit);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const showValidationToast = (message) => {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: message,
    });
  };
  const validateForm = () => {
    const errors = {};

    if (!formData.item_category_id) {
      errors.item_category_id = "Category is required";
    }

    if (!formData.item_name?.trim()) {
      errors.item_name = "Item Name is required";
    }

    if (isEditMode && !formData.item_status) {
      errors.item_status = "Status is required";
    }

    return errors;
  };

  const onSubmit = () => {
    if (!formData.item_category_id) {
      return showValidationToast("Category is required.");
    }

    if (!formData.item_name?.trim()) {
      return showValidationToast("Item Name is required.");
    }

    if (isEditMode && !formData.item_status) {
      return showValidationToast("Status is required.");
    }
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors)[0]); // or use your toast
      return;
    }
    const data = new FormData();

    data.append("item_category_id", formData.item_category_id);
    data.append("item_name", formData.item_name);
    data.append("item_rate", formData.item_rate);
    data.append("item_piece", formData.item_piece);
    data.append("item_size", formData.item_size);
    data.append("item_brand", formData.item_brand);
    data.append("item_surface", formData.item_surface);
    data.append("item_minimum_stock", formData.item_minimum_stock);

    if (isEditMode) {
      data.append("_method", "PUT");

      data.append("item_status", formData.item_status);
    }

    if (imageFile) {
      data.append("item_image", imageFile); // Binary file
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
          <Button
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            <SquarePlus className="h-4 w-4 mr-2" /> Item
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        {isFetching ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Update Item" : "Create New Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={formData.item_category_id?.toString()}
                    onValueChange={(v) =>
                      handleInputChange("item_category_id", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Item Name *</label>
                  <Input
                    placeholder="Enter Item Name"
                    value={formData.item_name}
                    onChange={(e) =>
                      handleInputChange("item_name", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Rate</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.item_rate}
                    onChange={(e) =>
                      handleInputChange("item_rate", e.target.value)
                    }
                  />
                </div>
                {branchUnit === "Yes" && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Piece per Box</label>
                    <Input
                      type="number"
                      placeholder="Enter piece count"
                      value={formData.item_piece}
                      onChange={(e) =>
                        handleInputChange("item_piece", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Size</label>
                  <Input
                    placeholder="e.g. XL"
                    value={formData.item_size}
                    onChange={(e) =>
                      handleInputChange("item_size", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    placeholder="Brand name"
                    value={formData.item_brand}
                    onChange={(e) =>
                      handleInputChange("item_brand", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Surface</label>
                  <Input
                    placeholder="Surface type"
                    value={formData.item_surface}
                    onChange={(e) =>
                      handleInputChange("item_surface", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Min Stock</label>
                  <Input
                    type="number"
                    placeholder="Minimum quantity"
                    value={formData.item_minimum_stock}
                    onChange={(e) =>
                      handleInputChange("item_minimum_stock", e.target.value)
                    }
                  />
                </div>
                {isEditMode && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status *</label>
                    <Select
                      value={formData.item_status}
                      onValueChange={(v) => handleInputChange("item_status", v)}
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
                  <label className="text-sm font-medium">Item Image</label>

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

                    {(imagePreview || formData.item_image) && (
                      <img
                        src={
                          imagePreview || `${IMAGE_URL}/${formData.item_image}`
                        }
                        alt="Preview"
                        className="h-20 w-20 rounded border object-cover shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className={`w-full mt-4 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  "Update Item"
                ) : (
                  "Create Item"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
