import React from "react";
import moment from "moment";

const PurchaseReportTable = ({
  reportData,
  containerRef,
  formData,
}) => {
  return (
    <div
      className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 print:p-4"
      ref={containerRef}
    >
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Purchase Report</h1>
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
            <th className="border-b border-gray-300 px-3 py-3 text-left font-bold text-gray-600 uppercase tracking-wider">Supplier Name</th>
            <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Vehicle No</th>
            <th className="border-b border-gray-300 px-3 py-3 text-right font-bold text-gray-600 uppercase tracking-wider">Box Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reportData?.purchase?.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 text-center font-mono text-blue-600">
                {transaction?.purchase_ref_no}
              </td>
              <td className="px-3 py-3 text-gray-600">
                {moment(transaction?.purchase_date).format("DD MMM YYYY")}
              </td>
              <td className="px-3 py-3 font-medium text-gray-700">
                {transaction?.purchase_buyer_name}
              </td>
              <td className="px-3 py-3 text-right text-gray-600">
                {transaction?.purchase_vehicle_no || "N/A"}
              </td>
              <td className="px-3 py-3 text-right font-bold text-gray-900">
                {transaction?.sum_purchase_sub_box}
              </td>
            </tr>
          ))}
          {(!reportData?.purchase || reportData.purchase.length === 0) && (
            <tr>
              <td colSpan={5} className="px-3 py-12 text-center text-gray-400 italic">
                No purchase records found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseReportTable;
