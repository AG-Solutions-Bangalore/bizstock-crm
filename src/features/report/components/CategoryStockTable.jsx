import React from "react";
import { IMAGE_URL, NO_IMAGE_URL } from "@/config/BaseUrl";

const CategoryStockTable = ({
  filteredStock,
  columnVisibility,
  singlebranch,
  doublebranch,
  categoryName,
  grandTotal,
  containerRef,
}) => {
  const toBoxPiece = (val, itemPiece = 1) => ({
    box: Math.floor(val / itemPiece),
    piece: val % itemPiece,
  });

  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
  const isSingleBranch = (singlebranch === "Yes" && doublebranch === "No") || (singlebranch === "No" && doublebranch === "Yes");

  return (
    <div
      className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 print:p-4"
      ref={containerRef}
    >
      <div className="mb-6 flex justify-between items-center print:border-b print:pb-4">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Category Stock Summary</h2>
        <div className="text-right text-gray-500 text-sm">
          {categoryName && <span className="font-semibold text-gray-700">{categoryName}</span>}
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-200 text-[11px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-3 py-3 text-left font-bold uppercase tracking-wider text-gray-600" rowSpan={2}>
              Design Name
            </th>
            <th className="border border-gray-300 px-3 py-3 text-center font-bold uppercase tracking-wider text-gray-600" rowSpan={2}>
              Product Image
            </th>
            {columnVisibility.box && (
              <th className="border border-gray-300 px-3 py-2 text-center font-bold uppercase tracking-wider text-gray-600" colSpan={isDoubleBranch ? 2 : 1}>
                Stock Available
              </th>
            )}
          </tr>
          {columnVisibility.box && isDoubleBranch && (
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-500">Box</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-500">Piece</th>
            </tr>
          )}
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredStock.map((item) => {
            const totalBP = toBoxPiece(item.total, item.item_piece || 1);
            
            return (
              <tr key={item.item_id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="border border-gray-300 px-3 py-3 font-medium text-gray-700">
                  {item.item_name}
                </td>
                <td className="border border-gray-300 px-3 py-3 text-center">
                  <div className="flex justify-center">
                    <img
                      src={item.item_image ? `${IMAGE_URL}/${item.item_image}` : NO_IMAGE_URL}
                      alt={item.item_name}
                      className="w-auto h-32 md:h-40 object-contain rounded border border-gray-100 shadow-sm"
                    />
                  </div>
                </td>

                {columnVisibility.box && (
                  isSingleBranch ? (
                    <td className={`border border-gray-300 px-3 py-3 text-right font-semibold ${item.total === 0 ? "text-gray-300" : "text-gray-900"}`}>
                      {item.total}
                    </td>
                  ) : isDoubleBranch && (
                    <>
                      <td className={`border border-gray-300 px-3 py-3 text-right font-semibold ${totalBP.box === 0 ? "text-gray-300" : "text-gray-900"}`}>
                        {totalBP.box}
                      </td>
                      <td className={`border border-gray-300 px-3 py-3 text-right font-semibold ${totalBP.piece === 0 ? "text-gray-300" : "text-gray-900"}`}>
                        {totalBP.piece}
                      </td>
                    </>
                  )
                )}
              </tr>
            );
          })}
        </tbody>

        {columnVisibility.box && (
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-3 py-4 text-right text-sm uppercase tracking-wider" colSpan={2}>
                Grand Total
              </td>
              {isSingleBranch ? (
                <td className="border border-gray-300 px-3 py-4 text-right text-sm text-blue-700">
                  {grandTotal}
                </td>
              ) : isDoubleBranch && (
                <>
                  <td className="border border-gray-300 px-3 py-4 text-right text-sm text-blue-700">
                    {toBoxPiece(grandTotal, filteredStock[0]?.item_piece || 1).box}
                  </td>
                  <td className="border border-gray-300 px-3 py-4 text-right text-sm text-blue-700">
                    {toBoxPiece(grandTotal, filteredStock[0]?.item_piece || 1).piece}
                  </td>
                </>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default CategoryStockTable;
