import React from "react";
import moment from "moment";

const OverallStockTable = ({
  stockData,
  range,
  isDoubleBranch,
  columnVisibility,
  containerRef,
  formData,
}) => {
  return (
    <div
      className="overflow-x-auto text-[11px] bg-white rounded-2xl border border-gray-100 shadow-sm p-2 md:p-6 print:p-0"
      ref={containerRef}
    >
      {/* Print Header */}
      <div className="hidden print:block mb-8">
        <div className="flex justify-between items-end border-b-2 border-gray-900 pb-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Stock Summary</h1>
            <p className="text-sm font-bold text-gray-500 tracking-widest mt-1 uppercase">Generated on {moment().format("DD MMMM YYYY")}</p>
          </div>
          <div className="text-right flex gap-8">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period From</p>
              <p className="text-sm font-bold">{moment(formData.from_date).format("DD-MMM-YYYY")}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period To</p>
              <p className="text-sm font-bold">{moment(formData.to_date).format("DD-MMM-YYYY")}</p>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-black">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th
              className="border border-black px-2 py-2 text-center"
              rowSpan={2}
            >
              Item Name
            </th>

            {isDoubleBranch ? (
              <>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Open Balance
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Purchase
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Purchase Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Dispatch
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Dispatch Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={(columnVisibility.box ? 1 : 0) + (columnVisibility.piece ? 1 : 0)}
                >
                  Close Balance
                </th>
              </>
            ) : (
              <>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Open Balance
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Purchase
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Purchase Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Dispatch
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Dispatch Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  rowSpan={2}
                >
                  Close Balance
                </th>
              </>
            )}
          </tr>

          {isDoubleBranch && (
            <tr>
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
              {columnVisibility.box && <th className="border border-black px-2 py-2 text-center">Box</th>}
              {columnVisibility.piece && <th className="border border-black px-2 py-2 text-center">Piece</th>}
            </tr>
          )}
        </thead>

        {stockData && (
          <tbody>
            {stockData
              .filter((item) => {
                const itemPiece = Number(item.item_piece) || 1;

                const openingPurch =
                  Number(item.openpurch) * itemPiece +
                  Number(item.openpurch_piece);
                const openingSale =
                  Number(item.closesale) * itemPiece +
                  Number(item.closesale_piece);
                const openingPurchR =
                  Number(item.openpurchR) * itemPiece +
                  Number(item.openpurchR_piece);
                const openingSaleR =
                  Number(item.closesaleR) * itemPiece +
                  Number(item.closesaleR_piece);

                const opening =
                  openingPurch -
                  openingSale -
                  openingPurchR +
                  openingSaleR;

                const purchase =
                  Number(item.purch) * itemPiece +
                  Number(item.purch_piece);
                const purchaseR =
                  Number(item.purchR) * itemPiece +
                  Number(item.purchR_piece);
                const sale =
                  Number(item.sale) * itemPiece +
                  Number(item.sale_piece);
                const saleR =
                  Number(item.saleR) * itemPiece +
                  Number(item.saleR_piece);

                const total =
                  opening + purchase - purchaseR - sale + saleR;
                return total >= range[0] && total <= range[1];
              })
              .map((item, index) => {
                const itemPiece = Number(item.item_piece) || 1;

                const openingPurch =
                  Number(item.openpurch) * itemPiece +
                  Number(item.openpurch_piece);
                const openingSale =
                  Number(item.closesale) * itemPiece +
                  Number(item.closesale_piece);
                const openingPurchR =
                  Number(item.openpurchR) * itemPiece +
                  Number(item.openpurchR_piece);
                const openingSaleR =
                  Number(item.closesaleR) * itemPiece +
                  Number(item.closesaleR_piece);

                const opening =
                  openingPurch -
                  openingSale -
                  openingPurchR +
                  openingSaleR;

                const purchase =
                  Number(item.purch) * itemPiece +
                  Number(item.purch_piece);
                const purchaseR =
                  Number(item.purchR) * itemPiece +
                  Number(item.purchR_piece);
                const sale =
                  Number(item.sale) * itemPiece +
                  Number(item.sale_piece);
                const saleR =
                  Number(item.saleR) * itemPiece +
                  Number(item.saleR_piece);

                const total =
                  opening + purchase - purchaseR - sale + saleR;

                const toBoxPiece = (val) => ({
                  box: Math.floor(val / itemPiece),
                  piece: val % itemPiece,
                });

                const openingBP = toBoxPiece(opening);
                const purchaseBP = toBoxPiece(purchase);
                const purchaseRBP = toBoxPiece(purchaseR);
                const saleBP = toBoxPiece(sale);
                const saleRBP = toBoxPiece(saleR);
                const totalBP = toBoxPiece(total);

                return (
                  <tr
                    key={item.id || item.item_name}
                    className="hover:bg-gray-50"
                  >
                    <td className="border border-black px-2 py-2">
                      {item.item_name}
                    </td>

                    {isDoubleBranch ? (
                      <>
                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              openingBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {openingBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              openingBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {openingBP.piece}
                          </td>
                        )}

                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              purchaseBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {purchaseBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              purchaseBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {purchaseBP.piece}
                          </td>
                        )}

                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              purchaseRBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {purchaseRBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              purchaseRBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {purchaseRBP.piece}
                          </td>
                        )}

                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              saleBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {saleBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              saleBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {saleBP.piece}
                          </td>
                        )}

                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              saleRBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {saleRBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              saleRBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {saleRBP.piece}
                          </td>
                        )}

                        {columnVisibility.box && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              totalBP.box == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {totalBP.box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td
                            className={`border border-black px-2 py-2 text-right ${
                              totalBP.piece == "0" ? "opacity-50" : ""
                            }`}
                          >
                            {totalBP.piece}
                          </td>
                        )}
                      </>
                    ) : (
                      <>
                        <td
                          className={`border border-black px-2 py-2 text-right ${
                            opening == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {opening}
                        </td>
                        <td
                          className={`border border-black px-2 py-2 text-right ${
                            purchase == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {purchase}
                        </td>
                        <td
                          className={`border border-black px-2 py-2 text-right ${
                            purchaseR == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {purchaseR}
                        </td>
                        <td
                          className={`border border-black px-2 py-2 text-right ${
                            sale == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {sale}
                        </td>
                        <td
                          className={`border border-black px-2 py-2 text-right ${
                            saleR == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {saleR}
                        </td>
                        <td
                          className={`border border-black px-2 py-2 text-right font-bold ${
                            total == "0" ? "opacity-50" : ""
                          }`}
                        >
                          {total}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default OverallStockTable;
