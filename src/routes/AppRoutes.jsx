import { Route, Routes } from "react-router-dom";

// Auth & Shared
import ForgotPassword from "@/app/auth/ForgotPassword";
import Login from "@/app/auth/Login";
import Signup from "@/app/auth/Signup";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import Maintenance from "@/components/common/Maintenance";
import NotFound from "@/app/errors/NotFound";
import Home from "@/app/home/Home";
import ValidationWrapper from "@/utils/ValidationWrapper";

// Master Data (Route Wrappers)
import BranchList from "@/app/master/branch/BranchList";
import BuyerList from "@/app/master/buyer/BuyerList";
import CategoryList from "@/app/master/category/CategoryList";
import GoDownList from "@/app/master/godown/GoDownList";
import ItemList from "@/app/master/item/ItemList";
import TeamList from "@/app/master/team/TeamList";

// Feature Routes (Route Wrappers)
import StockView from "@/app/stock/StockViewRoute";
import StockBatchView from "@/app/stock/StockBatchRoute";

import DispatchList from "@/app/dispatch/DispatchList";
import CreateDispatch from "@/app/dispatch/CreateDispatch";
import DispatchView from "@/app/dispatch/DispatchView";

import DispatchReturnList from "@/app/dispatchreturn/DispatchReturnList";
import CreateDispatchReturn from "@/app/dispatchreturn/CreateDispatchReturnForm";
import DispatchReturnView from "@/app/dispatchreturn/DispatchReturnView";

import InvoiceList from "@/app/invoice/InvoiceList";
import InvoiceForm from "@/app/invoice/InvoiceForm";

import PaymentList from "@/app/payment/PaymentList";

import QuotationList from "@/app/quotation/QuotationList";
import QuotationForm from "@/app/quotation/QuotationForm";

import PreBookingList from "@/app/prebooking/PreBookingList";
import PreBookingForm from "@/app/prebooking/PreBookingForm";
import PreBookingView from "@/app/prebooking/PreBookingView";

import PurchaseList from "@/app/purchase/PurchaseList";
import CreatePurchase from "@/app/purchase/CreatePurchase";
import PurchaseView from "@/app/purchase/PurchaseView";

import PurchaseReturnList from "@/app/purchasereturn/PurchaseReturnList";
import CreatePurchaseReturn from "@/app/purchasereturn/CreatePurchaseReturn";
import PurchaseReturnView from "@/app/purchasereturn/PurchaseReturnView";

// Report Routes (Route Wrappers)
import BuyerReport from "@/app/report/BuyerReport";
import CategoryStock from "@/app/report/CategoryStock";
import DispatchReport from "@/app/report/DispatchReport";
import GoDownStock from "@/app/report/GoDownStock";
import OverallStock from "@/app/report/OverallStock";
import PaymentLedger from "@/app/report/PaymentLedger";
import PaymentSummary from "@/app/report/PaymentSummary";
import PurchaseReport from "@/app/report/PurchaseReport";
import SingleItemStock from "@/app/report/SingleItemStock";

function AppRoutes() {
  return (
    <ValidationWrapper>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />

          {/* Master Data */}
          <Route path="/master/buyer" element={<BuyerList />} />
          <Route path="/master/item" element={<ItemList />} />
          <Route path="/master/category" element={<CategoryList />} />
          <Route path="/master/branch" element={<BranchList />} />
          <Route path="/master/team" element={<TeamList />} />
          <Route path="/master/go-down" element={<GoDownList />} />

          {/* Stock */}
          <Route path="/stock-batch-view" element={<StockBatchView />} />
          <Route path="/stock-view" element={<StockView />} />

          {/* Purchase */}
          <Route path="/purchase" element={<PurchaseList />} />
          <Route path="/purchase/create" element={<CreatePurchase />} />
          <Route path="/purchase/edit/:id" element={<CreatePurchase />} />
          <Route path="/purchase/view/:id" element={<PurchaseView />} />

          {/* Purchase Return */}
          <Route path="/purchase-return" element={<PurchaseReturnList />} />
          <Route path="/purchase-return/create" element={<CreatePurchaseReturn />} />
          <Route path="/purchase-return/edit/:id" element={<CreatePurchaseReturn />} />
          <Route path="/purchase-return/view/:id" element={<PurchaseReturnView />} />

          {/* Pre-Booking */}
          <Route path="/pre-booking" element={<PreBookingList />} />
          <Route path="/pre-booking/create" element={<PreBookingForm />} />
          <Route path="/pre-booking/edit/:id" element={<PreBookingForm />} />
          <Route path="/pre-booking/view/:id" element={<PreBookingView />} />

          {/* Dispatch */}
          <Route path="/dispatch" element={<DispatchList />} />
          <Route path="/dispatch/create" element={<CreateDispatch />} />
          <Route path="/dispatch/edit/:id" element={<CreateDispatch />} />
          <Route path="/dispatch/view/:id" element={<DispatchView />} />

          {/* Dispatch Return */}
          <Route path="/dispatch-return" element={<DispatchReturnList />} />
          <Route path="/dispatch-return/create" element={<CreateDispatchReturn />} />
          <Route path="/dispatch-return/edit/:id" element={<CreateDispatchReturn />} />
          <Route path="/dispatch-return/view/:id" element={<DispatchReturnView />} />

          {/* Invoice */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/invoice-form" element={<InvoiceForm />} />
          <Route path="/invoice-form/:id" element={<InvoiceForm />} />

          {/* Quotation */}
          <Route path="/quotation" element={<QuotationList />} />
          <Route path="/quotation/form" element={<QuotationForm />} />
          <Route path="/quotation/form/:id" element={<QuotationForm />} />

          {/* Payment */}
          <Route path="/payment" element={<PaymentList />} />
          <Route path="/payment/form" element={<PaymentList />} />
          <Route path="/payment/form/:id" element={<PaymentList />} />

          {/* Reports */}
          <Route path="/report/stock" element={<OverallStock />} />
          <Route path="/report/buyer" element={<BuyerReport />} />
          <Route path="/report/single-item-stock" element={<SingleItemStock />} />
          <Route path="/report/payment-summary" element={<PaymentSummary />} />
          <Route path="/report/payment-ledger" element={<PaymentLedger />} />
          <Route path="/report/category-stock" element={<CategoryStock />} />
          <Route path="/report/godown-stock" element={<GoDownStock />} />
          <Route path="/report/purchase" element={<PurchaseReport />} />
          <Route path="/report/dispatch" element={<DispatchReport />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ValidationWrapper>
  );
}

export default AppRoutes;
