import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";
import { FileSignature, Printer } from "lucide-react";
import moment from "moment";
import { RiFileExcel2Line } from "react-icons/ri";

const DispatchItemDetailsView = ({
  formData,
  showDetails,
  setShowDetails,
  handlePrintPdf,
  downloadExcel,
  reportData,
  isDoubleBranch,
  columnVisibility,
}) => {
  if (!formData.sale_buyer) return null;

  return (
    <div className="mt-6">
      <Button
        onClick={() => setShowDetails(!showDetails)}
        className={`mb-4 print:hidden ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
      >
        <FileSignature className="h-4 w-4 mr-2" />
        {showDetails ? "Hide Item Details" : "View Item Details"}
      </Button>

      {showDetails && (
        <div className="mt-4">
          <div className="flex gap-2 mb-4 print:hidden">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> Print Report & Details
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={downloadExcel}
            >
              <RiFileExcel2Line className="h-4 w-4 mr-2" /> Excel Report &
              Details
            </Button>
          </div>

          <h3 className="text-md font-bold mb-3">
            Item Details ({formData.sale_buyer})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-[11px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 text-center">
                    Ref No
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Item Name
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Size
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Brand
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Batch No
                  </th>
                  {isDoubleBranch ? (
                    <>
                      {columnVisibility.box && (
                        <th className="border border-gray-300 px-2 py-2 text-right">
                          Box
                        </th>
                      )}
                      {columnVisibility.piece && (
                        <th className="border border-gray-300 px-2 py-2 text-right">
                          Piece
                        </th>
                      )}
                    </>
                  ) : (
                    columnVisibility.available_box && (
                      <th className="border border-gray-300 px-2 py-2 text-right">
                        Box
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {reportData?.details?.map((item, index) => {
                  const dObj = reportData.dispatch.find(
                    (d) => d.dispatch_ref === item.dispatch_ref,
                  );
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {dObj?.dispatch_ref_no || item.dispatch_ref}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {moment(item.dispatch_date).format("DD MMM YYYY")}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.item_name}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.item_size}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.item_brand}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.dispatch_sub_batch_no}
                      </td>
                      {isDoubleBranch ? (
                        <>
                          {columnVisibility.box && (
                            <td className="border border-gray-300 px-2 py-1 text-right">
                              {item.dispatch_sub_box}
                            </td>
                          )}
                          {columnVisibility.piece && (
                            <td className="border border-gray-300 px-2 py-1 text-right">
                              {item.dispatch_sub_piece}
                            </td>
                          )}
                        </>
                      ) : (
                        columnVisibility.available_box && (
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {item.dispatch_sub_box}
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchItemDetailsView;
