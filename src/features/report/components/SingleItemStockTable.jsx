import React from "react";
import moment from "moment";

const SingleItemStockTable = ({
  transactions,
  openingStock,
  closingStock,
  itemDetails,
  isDoubleBranch,
  containerRef,
  formData,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 print:p-4 max-w-6xl mx-auto space-y-6"
      ref={containerRef}
    >
      <div className="hidden print:block border-b pb-6 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Item Stock Ledger</h1>
            <p className="text-blue-600 font-medium">{itemDetails?.item_name}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>From: {moment(formData.from_date).format("DD-MMM-YYYY")}</p>
            <p>To: {moment(formData.to_date).format("DD-MMM-YYYY")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-end mb-2">
        <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
        <div className="flex gap-4">
          <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs text-[10px]">
            <span className="text-gray-500 font-bold uppercase mr-2">Opening:</span>
            <span className="font-bold text-gray-900">{openingStock.box} Box {isDoubleBranch && `${openingStock.piece} Pc`}</span>
          </div>
          <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-xs text-[10px]">
            <span className="text-blue-500 font-bold uppercase mr-2">Closing:</span>
            <span className="font-bold text-blue-900">{closingStock.box} Box {isDoubleBranch && `${closingStock.piece} Pc`}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-[10px]">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
            <tr>
              <th rowSpan="2" className="px-3 py-4 text-left border-b border-r">Date</th>
              <th rowSpan="2" className="px-3 py-4 text-left border-b border-r">Reference</th>
              <th colSpan={isDoubleBranch ? 2 : 1} className="px-3 py-2 text-center border-b border-r bg-green-50/50 text-green-700">Inward</th>
              <th colSpan={isDoubleBranch ? 2 : 1} className="px-3 py-2 text-center border-b border-r bg-emerald-50/50 text-emerald-700">In Return</th>
              <th colSpan={isDoubleBranch ? 2 : 1} className="px-3 py-2 text-center border-b border-r bg-red-50/50 text-red-700">Outward</th>
              <th colSpan={isDoubleBranch ? 2 : 1} className="px-3 py-2 text-center border-b border-r bg-orange-50/50 text-orange-700">Out Return</th>
              <th colSpan={isDoubleBranch ? 2 : 1} className="px-3 py-2 text-center border-b bg-blue-50 text-blue-700">Balance</th>
            </tr>
            <tr className="bg-gray-50/50">
              <th className="px-2 py-2 text-center border-b border-r">Box</th>
              {isDoubleBranch && <th className="px-2 py-2 text-center border-b border-r">Pc</th>}
              <th className="px-2 py-2 text-center border-b border-r">Box</th>
              {isDoubleBranch && <th className="px-2 py-2 text-center border-b border-r">Pc</th>}
              <th className="px-2 py-2 text-center border-b border-r">Box</th>
              {isDoubleBranch && <th className="px-2 py-2 text-center border-b border-r">Pc</th>}
              <th className="px-2 py-2 text-center border-b border-r">Box</th>
              {isDoubleBranch && <th className="px-2 py-2 text-center border-b border-r">Pc</th>}
              <th className="px-2 py-2 text-center border-b border-r">Box</th>
              {isDoubleBranch && <th className="px-2 py-2 text-center border-b">Pc</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            <tr className="bg-gray-50/30">
              <td className="px-3 py-2 text-gray-500">{moment(formData.from_date).format("DD MMM YYYY")}</td>
              <td className="px-3 py-2 font-bold text-gray-800">Opening Balance</td>
              <td colSpan={isDoubleBranch ? 8 : 4} className="border-r"></td>
              <td className="px-2 py-2 text-right font-bold text-blue-600 bg-blue-50/20">{openingStock.box}</td>
              {isDoubleBranch && <td className="px-2 py-2 text-right font-bold text-blue-600 bg-blue-50/20">{openingStock.piece}</td>}
            </tr>
            {transactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 text-gray-600">{moment(t.date).format("DD MMM YYYY")}</td>
                <td className="px-3 py-2 font-mono text-gray-700">{t.ref}</td>
                
                {/* Inward */}
                <td className="px-2 py-2 text-right font-bold text-green-600 bg-green-50/10 border-r">{t.type === "purchase" ? t.boxes : ""}</td>
                {isDoubleBranch && <td className="px-2 py-2 text-right font-bold text-green-600 bg-green-50/10 border-r">{t.type === "purchase" ? t.piece : ""}</td>}
                
                {/* Inward Return */}
                <td className="px-2 py-2 text-right font-bold text-emerald-600 bg-emerald-50/10 border-r">{t.type === "purchasereturn" ? t.boxes : ""}</td>
                {isDoubleBranch && <td className="px-2 py-2 text-right font-bold text-emerald-600 bg-emerald-50/10 border-r">{t.type === "purchasereturn" ? t.piece : ""}</td>}
                
                {/* Outward */}
                <td className="px-2 py-2 text-right font-bold text-red-600 bg-red-50/10 border-r">{t.type === "sale" ? t.boxes : ""}</td>
                {isDoubleBranch && <td className="px-2 py-2 text-right font-bold text-red-600 bg-red-50/10 border-r">{t.type === "sale" ? t.piece : ""}</td>}
                
                {/* Outward Return */}
                <td className="px-2 py-2 text-right font-bold text-orange-600 bg-orange-50/10 border-r">{t.type === "salereturn" ? t.boxes : ""}</td>
                {isDoubleBranch && <td className="px-2 py-2 text-right font-bold text-orange-600 bg-orange-50/10 border-r">{t.type === "salereturn" ? t.piece : ""}</td>}
                
                {/* Balance */}
                <td className="px-2 py-2 text-right font-black text-blue-800 bg-blue-50/30 border-r">{t.balance?.box}</td>
                {isDoubleBranch && <td className="px-2 py-2 text-right font-black text-blue-800 bg-blue-50/30">{t.balance?.piece}</td>}
              </tr>
            ))}
            <tr className="bg-gray-900 text-white">
              <td className="px-3 py-3">{moment(formData.to_date).format("DD MMM YYYY")}</td>
              <td className="px-3 py-3 font-bold uppercase tracking-wider">Final Closing Balance</td>
              <td colSpan={isDoubleBranch ? 8 : 4} className="border-gray-800 border-r"></td>
              <td className="px-2 py-3 text-right font-black text-blue-300">{closingStock.box}</td>
              {isDoubleBranch && <td className="px-2 py-3 text-right font-black text-blue-300">{closingStock.piece}</td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SingleItemStockTable;
