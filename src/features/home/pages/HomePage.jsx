import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useHomeData } from "../hooks/useHomeData";
import { useHomeExport } from "../hooks/useHomeExport";
import { TABS, MONTHS, getYears } from "../forms/homeConstants";
import StockTableSection from "../components/StockTableSection";
import StockTableBoth from "../components/StockTableBoth";
import DispatchBarChart from "../components/DispatchBarChart";

const HomePage = () => {
  const columnVisibility = useSelector((state) => state.columnVisibility);
  const {
    currentDate,
    selectedCategory, setSelectedCategory,
    selectedCategoryZero, setSelectedCategoryZero,
    categories,
    brands,
    selectedBrands, setSelectedBrands,
    searchQuery, setSearchQuery,
    searchQueryZero, setSearchQueryZero,
    selectedYear,
    selectedMonth,
    dashboardStock,
    isLoadingDashboard,
    isErrorDashboard,
    refetchDashboard,
    isLoadingStock,
    isErrorStock,
    refetchStock,
    filteredItems,
    filteredItemsZero,
    handleDateChange,
  } = useHomeData();

  const {
    containerRef,
    handlePrintPdf,
    downloadStockCSV,
    downloadOutOfStockCSV,
  } = useHomeExport(columnVisibility);

  const years = getYears();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  if (isErrorStock) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Home</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetchStock()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full p-0 md:p-4 sm:grid grid-cols-1">
        <Tabs defaultValue="stock-view" className="sm:hidden">
          <TabsList className="grid w-full grid-cols-3">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="stock-view">
            <StockTableSection
              title="Stock View"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredItems={filteredItems}
              categories={categories}
              containerRef={containerRef}
              handlePrintPdf={handlePrintPdf}
              downloadCSV={downloadStockCSV}
              currentDate={currentDate}
              print="true"
              loading={isLoadingStock}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              brands={brands}
            />
          </TabsContent>
          <TabsContent value="outofstock">
            <StockTableBoth
              title="Out of Stock"
              selectedCategory={selectedCategoryZero}
              setSelectedCategory={setSelectedCategoryZero}
              searchQuery={searchQueryZero}
              setSearchQuery={setSearchQueryZero}
              filteredItems={filteredItemsZero}
              categories={categories}
              containerRef={containerRef}
              handlePrintPdf={handlePrintPdf}
              print="true"
              downloadCSV={downloadOutOfStockCSV}
              currentDate={currentDate}
              loading={isLoadingStock}
            />
          </TabsContent>
          <TabsContent value="graph">
            <DispatchBarChart
              title="Monthly Calendar"
              stock={dashboardStock}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              years={years}
              months={MONTHS}
              handleChange={handleDateChange}
              currentYear={currentYear}
              isLoadingdashboord={isLoadingDashboard}
              isErrordashboord={isErrorDashboard}
              refetch={refetchDashboard}
              currentMonthIndex={currentMonthIndex}
            />
          </TabsContent>
        </Tabs>

        <div className="hidden sm:block space-y-4">
          <div className="rounded-md border max-h-[500px] overflow-y-auto">
            <DispatchBarChart
              title="Monthly Calendar"
              stock={dashboardStock}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              years={years}
              months={MONTHS}
              handleChange={handleDateChange}
              currentYear={currentYear}
              isLoadingdashboord={isLoadingDashboard}
              isErrordashboord={isErrorDashboard}
              refetch={refetchDashboard}
              currentMonthIndex={currentMonthIndex}
            />
          </div>
          <div className="rounded-md border max-h-[500px] overflow-y-auto">
            <StockTableBoth
              title="Out of Stock"
              selectedCategory={selectedCategoryZero}
              setSelectedCategory={setSelectedCategoryZero}
              searchQuery={searchQueryZero}
              setSearchQuery={setSearchQueryZero}
              filteredItems={filteredItemsZero}
              categories={categories}
              containerRef={containerRef}
              handlePrintPdf={handlePrintPdf}
              print="true"
              downloadCSV={downloadOutOfStockCSV}
              currentDate={currentDate}
              loading={isLoadingStock}
            />
          </div>
        </div>
      </div>
  );
};

export default HomePage;
