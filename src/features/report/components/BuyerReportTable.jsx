import React from "react";

const BuyerReportTable = ({
  buyerData,
  containerRef,
}) => {
  return (
    <div
      className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8 print:p-4 max-w-5xl mx-auto"
      ref={containerRef}
    >
      <div className="hidden print:block border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Buyer Summary Report</h1>
      </div>

      <table className="w-full border-collapse text-[11px] border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider border-b">Buyer Name</th>
            <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider border-b">City</th>
            <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase tracking-wider border-b">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {buyerData && buyerData.length > 0 ? (
            buyerData.map((buyer, index) => (
              <tr key={buyer.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{buyer.buyer_name}</td>
                <td className="px-4 py-3 text-gray-600">{buyer.buyer_city || "N/A"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    buyer.buyer_status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {buyer.buyer_status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-10 text-center text-gray-400 italic">
                No buyer records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BuyerReportTable;
