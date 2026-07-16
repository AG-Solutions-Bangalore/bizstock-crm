import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";

const StockBatchTable = ({ data, range, containerRef, formData }) => {
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const filteredData = data.filter((buyer) => {
    const itemPiece = Number(buyer.item_piece) || 1;

    const openingPurch =
      Number(buyer.openpurch || 0) * itemPiece +
      Number(buyer.openpurch_piece || 0);
    const openingSale =
      Number(buyer.closesale || 0) * itemPiece +
      Number(buyer.closesale_piece || 0);
    const openingPurchR =
      Number(buyer.openpurchR || 0) * itemPiece +
      Number(buyer.openpurchR_piece || 0);
    const openingSaleR =
      Number(buyer.closesaleR || 0) * itemPiece +
      Number(buyer.closesaleR_piece || 0);

    const opening = openingPurch - openingSale - openingPurchR + openingSaleR;

    const purchase =
      Number(buyer.purch || 0) * itemPiece + Number(buyer.purch_piece || 0);
    const purchaseR =
      Number(buyer.purchR || 0) * itemPiece + Number(buyer.purchR_piece || 0);
    const sale =
      Number(buyer.sale || 0) * itemPiece + Number(buyer.sale_piece || 0);
    const saleR =
      Number(buyer.saleR || 0) * itemPiece + Number(buyer.saleR_piece || 0);

    const total = opening + purchase - purchaseR - sale + saleR;
    return total >= range[0] && total <= range[1];
  });

  const toBoxPiece = (val, itemPiece) => ({
    box: Math.floor(val / itemPiece),
    piece: val % itemPiece,
  });

  return (
    <div
      className="overflow-x-auto text-[11px] grid grid-cols-1 p-6 print:p-4"
      ref={containerRef}
    >
      <div className="hidden print:block">
        <div className="flex justify-between">
          <h1 className="text-left text-2xl font-semibold mb-3">
            Stock Batch Summary
          </h1>
          <div className="flex space-x-6">
            <h1>From - {moment(formData.from_date).format("DD-MMM-YYYY")}</h1>
            <h1>To - {moment(formData.to_date).format("DD-MMM-YYYY")}</h1>
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
            <th
              className="border border-black px-2 py-2 text-center"
              rowSpan={2}
            >
              Batch No
            </th>
            {singlebranch === "Yes" && doublebranch === "Yes" ? (
              <>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
                >
                  Open Balance
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
                >
                  Purchase
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
                >
                  Purchase Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
                >
                  Dispatch
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
                >
                  Dispatch Return
                </th>
                <th
                  className="border border-black px-2 py-2 text-center"
                  colSpan={2}
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
          {singlebranch === "Yes" && doublebranch === "Yes" && (
            <tr>
              {[...Array(6)].map((_, i) => (
                <>
                  <th className="border border-black px-2 py-2 text-center">
                    Box
                  </th>
                  <th className="border border-black px-2 py-2 text-center">
                    Piece
                  </th>
                </>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredData.map((buyer, index) => {
            const itemPiece = Number(buyer.item_piece) || 1;
            const opening =
              Number(buyer.openpurch || 0) * itemPiece +
              Number(buyer.openpurch_piece || 0) -
              (Number(buyer.closesale || 0) * itemPiece +
                Number(buyer.closesale_piece || 0)) -
              (Number(buyer.openpurchR || 0) * itemPiece +
                Number(buyer.openpurchR_piece || 0)) +
              (Number(buyer.closesaleR || 0) * itemPiece +
                Number(buyer.closesaleR_piece || 0));
            const purchase =
              Number(buyer.purch || 0) * itemPiece +
              Number(buyer.purch_piece || 0);
            const purchaseR =
              Number(buyer.purchR || 0) * itemPiece +
              Number(buyer.purchR_piece || 0);
            const sale =
              Number(buyer.sale || 0) * itemPiece +
              Number(buyer.sale_piece || 0);
            const saleR =
              Number(buyer.saleR || 0) * itemPiece +
              Number(buyer.saleR_piece || 0);
            const total = opening + (purchase - purchaseR) - (sale - saleR);

            if (singlebranch === "Yes" && doublebranch === "Yes") {
              const bps = [
                opening,
                purchase,
                purchaseR,
                sale,
                saleR,
                total,
              ].map((v) => toBoxPiece(v, itemPiece));
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black px-2 py-2">
                    {buyer.item_name}
                  </td>
                  <td className="border border-black px-2 py-2">
                    {buyer.batch_no}
                  </td>
                  {bps.map((bp, i) => (
                    <>
                      <td
                        className={`border border-black px-2 py-2 text-right ${bp.box === 0 ? "opacity-50" : ""}`}
                      >
                        {bp.box}
                      </td>
                      <td
                        className={`border border-black px-2 py-2 text-right ${bp.piece === 0 ? "opacity-50" : ""}`}
                      >
                        {bp.piece}
                      </td>
                    </>
                  ))}
                </tr>
              );
            }

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-black px-2 py-2">
                  {buyer.item_name}
                </td>
                <td className="border border-black px-2 py-2">
                  {buyer.batch_no}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {opening}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {purchase}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {purchaseR}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {sale}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {saleR}
                </td>
                <td className="border border-black px-2 py-2 text-right">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockBatchTable;
