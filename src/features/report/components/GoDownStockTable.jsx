import React from "react";
import moment from "moment";

const GoDownStockTable = ({
  processedStock,
  singlebranch,
  doublebranch,
  grand,
  containerRef,
  formData,
}) => {
  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";

  return (
    <div
      className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 print:p-4"
      ref={containerRef}
    >
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Stock Godown Summary</h1>
          <div className="text-right text-sm text-gray-500 space-y-1">
            <p>From: <span className="font-semibold text-gray-700">{moment(formData.from_date).format("DD-MMM-YYYY")}</span></p>
            <p>To: <span className="font-semibold text-gray-700">{moment(formData.to_date).format("DD-MMM-YYYY")}</span></p>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-200 text-[10px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-2 py-3 text-center font-bold uppercase tracking-wider text-gray-600" rowSpan={2}>
              Item Name
            </th>
            {isDoubleBranch ? (
              <>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Open Balance</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Purchase</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Purchase Return</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Dispatch</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Dispatch Return</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-bold text-gray-600" colSpan={2}>Close Balance</th>
              </>
            ) : (
              <>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Open Balance</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Purchase</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Purchase Return</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Dispatch</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Dispatch Return</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-600" rowSpan={2}>Close Balance</th>
              </>
            )}
          </tr>
          {isDoubleBranch && (
            <tr className="bg-gray-50">
              {[...Array(6)].map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border border-gray-300 px-1 py-2 text-center text-[9px] font-semibold text-gray-500">Box</th>
                  <th className="border border-gray-300 px-1 py-2 text-center text-[9px] font-semibold text-gray-500">Piece</th>
                </React.Fragment>
              ))}
            </tr>
          )}
        </thead>

        <tbody>
          {processedStock.map((godown) => (
            <React.Fragment key={godown.godown_id}>
              <tr className="bg-blue-50/50">
                <td className="border border-gray-300 px-3 py-2 font-bold text-blue-800 text-sm" colSpan={isDoubleBranch ? 13 : 7}>
                  {godown.godown_name}
                </td>
              </tr>
              {godown.items.map((item, idx) => (
                <tr key={`${godown.godown_id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-2 py-2 font-medium text-gray-700">{item.item_name}</td>
                  {isDoubleBranch ? (
                    <>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.openingBP.box === 0 ? "text-gray-300" : ""}`}>{item.openingBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.openingBP.piece === 0 ? "text-gray-300" : ""}`}>{item.openingBP.piece}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.purchaseBP.box === 0 ? "text-gray-300" : ""}`}>{item.purchaseBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.purchaseBP.piece === 0 ? "text-gray-300" : ""}`}>{item.purchaseBP.piece}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.purchaseRBP.box === 0 ? "text-gray-300" : ""}`}>{item.purchaseRBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.purchaseRBP.piece === 0 ? "text-gray-300" : ""}`}>{item.purchaseRBP.piece}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.saleBP.box === 0 ? "text-gray-300" : ""}`}>{item.saleBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.saleBP.piece === 0 ? "text-gray-300" : ""}`}>{item.saleBP.piece}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.saleRBP.box === 0 ? "text-gray-300" : ""}`}>{item.saleRBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right ${item.saleRBP.piece === 0 ? "text-gray-300" : ""}`}>{item.saleRBP.piece}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right font-bold ${item.totalBP.box === 0 ? "text-gray-300" : ""}`}>{item.totalBP.box}</td>
                      <td className={`border border-gray-300 px-1 py-2 text-right font-bold ${item.totalBP.piece === 0 ? "text-gray-300" : ""}`}>{item.totalBP.piece}</td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-300 px-2 py-2 text-right">{item.opening}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">{item.purchase}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">{item.purchaseR}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">{item.sale}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">{item.saleR}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right font-bold">{item.total}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr className="bg-amber-50 font-semibold text-amber-900">
                <td className="border border-gray-300 px-3 py-2 text-right italic">Godown Subtotal</td>
                {isDoubleBranch ? (
                  <>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.openingBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.openingPiece}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.purchaseBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.purchasePiece}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.purchaseRBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.purchaseRPiece}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.saleBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.salePiece}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.saleRBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right">{godown.saleRPiece}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right font-bold">{godown.totalBox}</td>
                    <td className="border border-gray-300 px-1 py-2 text-right font-bold">{godown.totalPiece}</td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 px-2 py-2 text-right">{godown.openingBox}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right">{godown.purchaseBox}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right">{godown.purchaseRBox}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right">{godown.saleBox}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right">{godown.saleRBox}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right font-bold">{godown.totalBox}</td>
                  </>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-gray-800 text-white font-bold text-xs">
            <td className="border border-gray-600 px-3 py-3 text-right uppercase tracking-wider">Grand Total</td>
            {isDoubleBranch ? (
              <>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.openingBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.openingPiece}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.purchaseBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.purchasePiece}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.purchaseRBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.purchaseRPiece}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.saleBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.salePiece}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.saleRBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right">{grand.saleRPiece}</td>
                <td className="border border-gray-600 px-1 py-3 text-right text-sm">{grand.totalBox}</td>
                <td className="border border-gray-600 px-1 py-3 text-right text-sm">{grand.totalPiece}</td>
              </>
            ) : (
              <>
                <td className="border border-gray-600 px-2 py-3 text-right">{grand.openingBox}</td>
                <td className="border border-gray-600 px-2 py-3 text-right">{grand.purchaseBox}</td>
                <td className="border border-gray-600 px-2 py-3 text-right">{grand.purchaseRBox}</td>
                <td className="border border-gray-600 px-2 py-3 text-right">{grand.saleBox}</td>
                <td className="border border-gray-600 px-2 py-3 text-right">{grand.saleRBox}</td>
                <td className="border border-gray-600 px-2 py-3 text-right text-sm">{grand.totalBox}</td>
              </>
            )}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default GoDownStockTable;
