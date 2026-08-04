import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { IMAGE_URL, NO_IMAGE_URL } from "@/config/BaseUrl";

const ItemViewDialog = ({ item }) => {
  if (!item) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
          <Eye className="h-4 w-4 text-yellow-700" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="border-b pb-3 border-yellow-100">
          <DialogTitle className="text-xl font-bold text-yellow-900">
            Item Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-300">
          {/* Images Gallery */}
          <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs text-yellow-800 font-medium">Item Image</span>
                <img
                  src={item.item_image ? `${IMAGE_URL}/${item.item_image}` : NO_IMAGE_URL}
                  alt="Item"
                  className="h-36 object-contain rounded-lg shadow-sm border border-white bg-white w-full"
                  onError={(e) => {
                    e.target.src = NO_IMAGE_URL;
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs text-yellow-800 font-medium">Other Image</span>
                <img
                  src={item.item_other_image ? `${IMAGE_URL}/${item.item_other_image}` : NO_IMAGE_URL}
                  alt="Other"
                  className="h-36 object-contain rounded-lg shadow-sm border border-white bg-white w-full"
                  onError={(e) => {
                    e.target.src = NO_IMAGE_URL;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-1">
            <div className="col-span-2 border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Item Name</span>
              <span className="text-base font-bold text-yellow-950 text-right">{item.item_name}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Category</span>
              <span className="text-sm font-semibold text-gray-800">{item.item_category || "N/A"}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Rate</span>
              <span className="text-sm font-semibold text-gray-800">₹{item.item_rate || "0.00"}</span>
            </div>

            {item.item_piece && (
              <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-800/80">Pcs / Box</span>
                <span className="text-sm font-semibold text-gray-800">{item.item_piece}</span>
              </div>
            )}

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Size</span>
              <span className="text-sm font-semibold text-gray-800">{item.item_size || "N/A"}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Brand</span>
              <span className="text-sm font-semibold text-gray-800">{item.item_brand || "N/A"}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Surface</span>
              <span className="text-sm font-semibold text-gray-800">{item.item_surface || "N/A"}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Min Stock</span>
              <span className="text-sm font-semibold text-gray-800">{item.item_minimum_stock || "0"}</span>
            </div>

            <div className="border-b pb-2 border-yellow-50 flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800/80">Status</span>
              <span className="flex items-center gap-1">
                {item.item_status === "Active" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-700">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">Inactive</span>
                  </>
                )}
              </span>
            </div>

            <div className="col-span-2 flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-yellow-800/80">Item ID</span>
              <span className="text-xs font-mono text-gray-500">#{item.id}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemViewDialog;
