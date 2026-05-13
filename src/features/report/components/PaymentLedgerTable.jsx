import React from "react";
import moment from "moment";

const PaymentLedgerTable = ({
  reportData,
  containerRef,
  formData,
}) => {
  if (!reportData?.ledger) return null;

  const ledgerEntries = Object.entries(reportData.ledger);

  if (ledgerEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
        <p>No ledger data found for the selected account and period.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 print:p-4 max-w-4xl mx-auto space-y-12"
      ref={containerRef}
    >
      <div className="hidden print:block border-b pb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Ledger Statement</h1>
          <div className="text-right text-sm text-gray-500">
            <p>Period: <span className="font-bold text-gray-700">{moment(formData.from_date).format("DD MMM YYYY")}</span> to <span className="font-bold text-gray-700">{moment(formData.to_date).format("DD MMM YYYY")}</span></p>
          </div>
        </div>
      </div>

      {ledgerEntries.map(([ledgerName, ledgerData], idx) => (
        <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end border-b-2 border-gray-100 pb-2">
            <h2 className="text-xl font-bold text-gray-800">{ledgerName}</h2>
            <div className="text-sm bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 shadow-xs">
              <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px] mr-2">Opening Balance:</span>
              <span className={`font-bold ${ledgerData.opening_balance < 0 ? "text-red-600" : "text-green-600"}`}>
                {Math.abs(ledgerData.opening_balance).toLocaleString()} {ledgerData.opening_balance < 0 ? "DR" : "CR"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-[11px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider border-b">Date</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider border-b">Transaction Type</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase tracking-wider border-b">Debit (DR)</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase tracking-wider border-b">Credit (CR)</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase tracking-wider border-b">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ledgerData.transactions.length > 0 ? (
                  ledgerData.transactions.map((txn, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {moment(txn.date).format("DD MMM YYYY")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        {Number(txn.debit) === 0 ? "" : Number(txn.debit).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        {Number(txn.credit) === 0 ? "" : Number(txn.credit).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${txn.balance < 0 ? "text-red-700 bg-red-50/30" : "text-green-700 bg-green-50/30"}`}>
                        {Math.abs(txn.balance).toLocaleString()} {txn.balance < 0 ? "DR" : "CR"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400 italic">
                      No transactions recorded in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Closing Balance</span>
              <span className="text-lg font-black tracking-tight">
                {Math.abs(ledgerData.closing_balance).toLocaleString()} {ledgerData.closing_balance < 0 ? "DR" : "CR"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentLedgerTable;
