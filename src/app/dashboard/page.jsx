import DashboardLayout from "@/features/dashboard/layouts/DashboardLayout";

// eslint-disable-next-line react/prop-types
export default function Page({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
