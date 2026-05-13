import React from "react";
import moment from "moment";

const PaymentSummaryTable = ({
  reportData,
  containerRef,
  formData,
}) => {
  const hasPaymentSummary = reportData?.paymentSummary?.length > 0;
  const hasBuyerSummary = reportData?.buyerpaymentSummary?.length > 0;

  if (!hasPaymentSummary && !hasBuyerSummary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
        <p>No payment summary data found for the selected period.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 print:p-4 max-w-4xl mx-auto space-y-10"
      ref={containerRef}
    >
      <div className="hidden print:block border-b pb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Payment Summary</h1>
          <div className="text-right text-sm text-gray-500">
            <p>From: <span className="font-bold text-gray-700">{moment(formData.from_date).format("DD MMM YYYY")}</span> To: <span className="font-bold text-gray-700">{moment(formData.to_date).format("DD MMM YYYY")}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Payment Mode Summary */}
        {hasPaymentSummary && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">By Payment Mode</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full border-collapse text-[11px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase border-b">Mode</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase border-b">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.paymentSummary.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700">{item?.payment_mode}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{Number(item?.total_amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50/50 font-bold">
                  <tr>
                    <td className="px-4 py-3 text-right uppercase tracking-wider text-blue-800">Total</td>
                    <td className="px-4 py-3 text-right text-blue-900 text-sm">
                      {Number(reportData.paymentSummarySum?.total_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Buyer Summary */}
        {hasBuyerSummary && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2">
              <div className="w-2 h-6 bg-emerald-600 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">By Buyer</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full border-collapse text-[11px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase border-b">Buyer Name</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase border-b">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.buyerpaymentSummary.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700">{item?.buyer_name}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{Number(item?.total_amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50/50 font-bold">
                  <tr>
                    <td className="px-4 py-3 text-right uppercase tracking-wider text-emerald-800">Total</td>
                    <td className="px-4 py-3 text-right text-emerald-900 text-sm">
                      {Number(reportData.paymentSummarySum?.total_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummaryTable;
