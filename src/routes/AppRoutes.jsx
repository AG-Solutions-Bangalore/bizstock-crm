import { Route, Routes } from "react-router-dom";

import StockView from "@/features/stock/pages/StockViewPage";

import ForgotPassword from "@/app/auth/ForgotPassword";
import Login from "@/app/auth/Login";
import Maintenance from "@/components/common/Maintenance";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";

import { CreateDispatchPage, DispatchListPage, DispatchViewPage } from "@/features/dispatch";
import { CreateDispatchReturnPage, DispatchReturnListPage, DispatchReturnViewPage } from "@/features/dispatch-return";
import NotFound from "@/app/errors/NotFound";
import Home from "@/app/home/Home";
import BranchList from "@/app/master/branch/BranchList";
import BuyerList from "@/app/master/buyer/BuyerList";
import CategoryList from "@/app/master/category/CategoryList";
import GoDownList from "@/app/master/godown/GoDownList";
import ItemList from "@/app/master/item/ItemList";
import TeamList from "@/app/master/team/TeamList";
import { InvoiceListPage, InvoiceFormPage } from "@/features/invoice";
import { PaymentListPage } from "@/features/payment";
import { QuotationListPage, QuotationFormPage } from "@/features/quotation";
import Signup from "@/app/auth/Signup";
import { PreBookingFormPage, PreBookingListPage, PreBookingViewPage } from "@/features/pre-booking";
import { CreatePurchasePage, PurchaseListPage, PurchaseViewPage } from "@/features/purchase";
import { CreatePurchaseReturnPage, PurchaseReturnListPage, PurchaseReturnViewPage } from "@/features/purchase-return";
import BuyerReport from "@/features/report/pages/BuyerReportPage";
import CategoryStock from "@/features/report/pages/CategoryStockPage";
import DispatchReport from "@/features/report/pages/DispatchReportPage";
import StockGoDown from "@/features/report/pages/GoDownStockPage";
import Stock from "@/features/report/pages/OverallStockPage";
import PaymentLedgerReport from "@/features/report/pages/PaymentLedgerPage";
import PaymentSummaryReport from "@/features/report/pages/PaymentSummaryPage";
import PurchaseReport from "@/features/report/pages/PurchaseReportPage";
import SingleItemStock from "@/features/report/pages/SingleItemStockPage";
import StockBatchView from "@/features/stock/pages/StockBatchPage";
import ValidationWrapper from "@/utils/ValidationWrapper";

function AppRoutes() {
  return (
    <ValidationWrapper>
      <Routes>
        {/* Done 4 layers done */}
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        {/*  */}

        {/* Done 4 layers done */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/master/buyer" element={<BuyerList />} />
          <Route path="/master/item" element={<ItemList />} />
          <Route path="/master/category" element={<CategoryList />} />
          <Route path="/master/branch" element={<BranchList />} />
          <Route path="/master/team" element={<TeamList />} />
          <Route path="/master/go-down" element={<GoDownList />} />
          <Route path="/stock-batch-view" element={<StockBatchView />} />
          <Route path="/stock-view" element={<StockView />} />

          <Route path="/purchase" element={<PurchaseListPage />} />
          <Route path="/purchase/create" element={<CreatePurchasePage />} />
          <Route path="/purchase/edit/:id" element={<CreatePurchasePage />} />
          <Route path="/purchase/view/:id" element={<PurchaseViewPage />} />
          <Route path="/purchase-return" element={<PurchaseReturnListPage />} />
          <Route
            path="/purchase-return/create"
            element={<CreatePurchaseReturnPage />}
          />
          <Route
            path="/purchase-return/edit/:id"
            element={<CreatePurchaseReturnPage />}
          />
          <Route
            path="/purchase-return/view/:id"
            element={<PurchaseReturnViewPage />}
          />





          <Route path="/pre-booking" element={<PreBookingListPage />} />
          <Route path="/pre-booking/create" element={<PreBookingFormPage />} />
          <Route path="/pre-booking/edit/:id" element={<PreBookingFormPage />} />
          <Route path="/pre-booking/view/:id" element={<PreBookingViewPage />} />



          <Route path="/dispatch" element={<DispatchListPage />} />
          <Route path="/dispatch/create" element={<CreateDispatchPage />} />
          <Route path="/dispatch/edit/:id" element={<CreateDispatchPage />} />
          <Route path="/dispatch/view/:id" element={<DispatchViewPage />} />

          <Route path="/dispatch-return" element={<DispatchReturnListPage />} />
          <Route
            path="/dispatch-return/create"
            element={<CreateDispatchReturnPage />}
          />
          <Route
            path="/dispatch-return/edit/:id"
            element={<CreateDispatchReturnPage />}
          />
          <Route
            path="/dispatch-return/view/:id"
            element={<DispatchReturnViewPage />}
          />

          {/*  */}

          <Route path="/invoice" element={<InvoiceListPage />} />
          <Route path="/invoice-form" element={<InvoiceFormPage />} />
          <Route path="/invoice-form/:id" element={<InvoiceFormPage />} />
          <Route path="/quotation" element={<QuotationListPage />} />
          <Route path="/quotation/form" element={<QuotationFormPage />} />
          <Route path="/quotation/form/:id" element={<QuotationFormPage />} />
          <Route path="/payment" element={<PaymentListPage />} />
          <Route path="/payment/form" element={<PaymentListPage />} />
          <Route path="/payment/form/:id" element={<PaymentListPage />} />

          {/* 4 layers done */}
          <Route path="/report/stock" element={<Stock />} />
          <Route path="/report/buyer" element={<BuyerReport />} />
          <Route
            path="/report/single-item-stock"
            element={<SingleItemStock />}
          />
          <Route
            path="/report/payment-summary"
            element={<PaymentSummaryReport />}
          />
          <Route
            path="/report/payment-ledger"
            element={<PaymentLedgerReport />}
          />
          <Route path="/report/category-stock" element={<CategoryStock />} />
          <Route path="/report/godown-stock" element={<StockGoDown />} />
          <Route path="/report/purchase" element={<PurchaseReport />} />
          <Route path="/report/dispatch" element={<DispatchReport />} />
        </Route>
        {/*  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ValidationWrapper>
  );
}

export default AppRoutes;
