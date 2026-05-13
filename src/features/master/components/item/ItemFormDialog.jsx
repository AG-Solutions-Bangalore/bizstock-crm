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
import { useItem } from "../../hooks/useItem";
import { useCategory } from "../../hooks/useCategory";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useSelector } from "react-redux";

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

  const { useCategoriesQuery } = useCategory();
  const { data: categories } = useCategoriesQuery();
  const branchUnit = useSelector((state) => state.auth.branch_d_unit);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
            <Edit className="h-4 w-4 text-yellow-700" />
          </Button>
        ) : (
          <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
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
              <DialogTitle>{isEditMode ? "Update Item" : "Create New Item"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select 
                    value={formData.item_category_id?.toString()} 
                    onValueChange={(v) => handleInputChange("item_category_id", v)}
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
                    onChange={(e) => handleInputChange("item_name", e.target.value)}
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
                    onChange={(e) => handleInputChange("item_rate", e.target.value)}
                  />
                </div>
                {branchUnit === "Yes" && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Piece per Box</label>
                    <Input
                      type="number"
                      placeholder="Enter piece count"
                      value={formData.item_piece}
                      onChange={(e) => handleInputChange("item_piece", e.target.value)}
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
                    onChange={(e) => handleInputChange("item_size", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    placeholder="Brand name"
                    value={formData.item_brand}
                    onChange={(e) => handleInputChange("item_brand", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Surface</label>
                  <Input
                    placeholder="Surface type"
                    value={formData.item_surface}
                    onChange={(e) => handleInputChange("item_surface", e.target.value)}
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
                    onChange={(e) => handleInputChange("item_minimum_stock", e.target.value)}
                  />
                </div>
                {isEditMode && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status *</label>
                    <Select value={formData.item_status} onValueChange={(v) => handleInputChange("item_status", v)}>
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
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full mt-4 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Update Item" : "Create Item")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
