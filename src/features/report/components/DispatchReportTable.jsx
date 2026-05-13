import React from "react";
import moment from "moment";

const DispatchReportTable = ({
  reportData,
  isDoubleBranch,
  columnVisibility,
  setSelectedRef,
  formData,
}) => {
  return (
    <div
      className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 print:p-4"
    >
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dispatch Report</h1>
          <div className="text-right text-sm text-gray-500 space-y-1">
            <p>From: <span className="font-semibold text-gray-700">{moment(formData.from_date).format("DD-MMM-YYYY")}</span></p>
            <p>To: <span className="font-semibold text-gray-700">{moment(formData.to_date).format("DD-MMM-YYYY")}</span></p>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-200 text-[11px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b border-gray-300 px-3 py-3 text-center font-bold text-gray-600 uppercase tracking-wider">Ref No</th>
            <th className="border-b border-gray-300 px-3 py-3 text-left font-bold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="border-b border-gray-300 px-3 py-3 text-left font-bold text-gray-600 uppercase tracking-wider">Buyer Name</th>
            <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Vehicle No</th>
            {isDoubleBranch ? (
              <>
                {columnVisibility.box && <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Box</th>}
                {columnVisibility.piece && <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Piece</th>}
              </>
            ) : (
              columnVisibility.available_box && <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Box</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reportData?.dispatch?.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td
                className="px-3 py-3 text-center font-mono text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors"
                onClick={() => setSelectedRef(transaction?.dispatch_ref)}
              >
                {transaction?.dispatch_ref_no}
              </td>
              <td className="px-3 py-3 text-gray-600">
                {moment(transaction?.dispatch_date).format("DD MMM YYYY")}
              </td>
              <td className="px-3 py-3 font-medium text-gray-700">
                {transaction?.buyer_name}
              </td>
              <td className="px-3 py-3 text-right text-gray-600">
                {transaction?.dispatch_vehicle_no || "N/A"}
              </td>
              {isDoubleBranch ? (
                <>
                  {columnVisibility.box && (
                    <td className="px-3 py-3 text-right font-bold text-gray-900">
                      {transaction?.sum_dispatch_sub_box}
                    </td>
                  )}
                  {columnVisibility.piece && (
                    <td className="px-3 py-3 text-right font-bold text-gray-900">
                      {transaction?.sum_dispatch_sub_piece}
                    </td>
                  )}
                </>
              ) : (
                columnVisibility.available_box && (
                  <td className="px-3 py-3 text-right font-bold text-gray-900">
                    {transaction?.sum_dispatch_sub_box}
                  </td>
                )
              )}
            </tr>
          ))}
          {(!reportData?.dispatch || reportData.dispatch.length === 0) && (
            <tr>
              <td colSpan={isDoubleBranch ? 6 : 5} className="px-3 py-12 text-center text-gray-400 italic">
                No dispatch records found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DispatchReportTable;
