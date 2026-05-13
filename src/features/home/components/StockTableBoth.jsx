import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Download, Printer, Search } from "lucide-react";
import { useSelector } from "react-redux";

function StockTableBoth({
  title,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  filteredItems,
  categories,
  containerRef,
  handlePrintPdf,
  downloadCSV,
  currentDate,
  print,
  setSelectedBrands,
  selectedBrands,
  brands,
  loading,
}) {
  const { toast } = useToast();
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="px-3 py-2 border-b md:hidden">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm md:text-lg font-semibold text-black">{title}</CardTitle>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-32 truncate">
                    <span className="truncate">{selectedCategory}</span>
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto" align="start">
                  {categories.map((category, index) => (
                    <DropdownMenuItem key={index} onSelect={() => setSelectedCategory(category)}>
                      <span className="truncate">{category}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {title == "Stock View" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className=" w-32 truncate">
                      <span className="truncate">{selectedBrands}</span>
                      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-60 overflow-y-auto" align="start">
                    {brands.map((brand) => (
                      <DropdownMenuItem key={brand} onSelect={() => setSelectedBrands(brand)}>
                        <span className="truncate">{brand}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {print == "true" && (
                <button className={`flex items-center justify-center sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.textColor} p-2 rounded-lg`} onClick={handlePrintPdf}>
                  <Printer className="h-4 w-4 mr-1" />
                </button>
              )}
              <button className={`flex items-center justify-center sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.textColor} p-2 rounded-lg`} onClick={() => downloadCSV(filteredItems, toast)}>
                <Download className="h-4 w-4 mr-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder={`Search ${title.toLowerCase()}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 bg-gray-50 w-full text-sm" />
            </div>
            <div className="text-sm text-gray-600">{filteredItems.length} items</div>
          </div>
        </div>
      </CardHeader>

      <CardHeader className={`hidden md:block px-3 py-2 border-b ${ButtonConfig.backgroundColor} ${ButtonConfig.textColor}`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-black">{title}</CardTitle>
          <div className="flex space-x-2">
            {print == "true" && (
              <Button size="sm" variant="outline" className="h-9 w-9" onClick={handlePrintPdf}><Printer className="h-4 w-4" /></Button>
            )}
            <Button size="sm" variant="outline" className="h-9 w-9" onClick={() => downloadCSV(filteredItems, toast)}><Download className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>

      {loading ? <div className="flex justify-center items-center min-h-[200px]"><Loader /></div> : (
        <CardContent className="p-2">
          {filteredItems?.length ? (
            <div className="text-[11px] grid grid-cols-1 p-0 md:p-6 print:p-4" ref={containerRef}>
              <div className="hidden print:block">
                <div className="flex justify-between ">
                  <h1 className="text-left text-2xl font-semibold mb-3 ">Out of Stock Summary</h1>
                  <div className="flex space-x-6"><h1> From - 2024-01-01</h1><h1>To -{currentDate}</h1></div>
                </div>
              </div>

              <table className="w-full border border-black border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border border-black px-2 py-2 text-center" rowSpan={2}>Item Name</th>
                    <th className="border border-black px-2 py-2 text-center" rowSpan={2}>Category</th>
                    {filteredItems[0]?.item_size !== undefined && <th className="hidden print:table-cell border border-black px-2 py-2 text-center" rowSpan={2}>Size</th>}
                    
                    {singlebranch !== doublebranch ? (
                      <>
                        <th className="border border-black px-2 py-2 text-center" rowSpan={2}>Minimum Stock</th>
                        <th className="border border-black px-2 py-2 text-center" rowSpan={2}>Available</th>
                      </>
                    ) : (
                      <>
                        <th className="border border-black px-2 py-2 text-center" colSpan={2}>Minimum Stock</th>
                        <th className="border border-black px-2 py-2 text-center" colSpan={2}>Available</th>
                      </>
                    )}
                  </tr>
                  {singlebranch === "Yes" && doublebranch === "Yes" && (
                    <tr>
                      <th className="border border-black px-2 py-2 text-center">Box</th>
                      <th className="border border-black px-2 py-2 text-center">Piece</th>
                      <th className="border border-black px-2 py-2 text-center">Box</th>
                      <th className="border border-black px-2 py-2 text-center">Piece</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => {
                    const itemPiece = Number(item.item_piece) || 1;
                    const minimumStock = Number(item?.item_minimum_stock) || 0;
                    const total = (Number(item.openpurch) * itemPiece + Number(item.openpurch_piece)) -
                                (Number(item.closesale) * itemPiece + Number(item.closesale_piece)) +
                                ((Number(item.purch) * itemPiece + Number(item.purch_piece)) -
                                 (Number(item.sale) * itemPiece + Number(item.sale_piece)));

                    if (total < minimumStock) {
                      const box = Math.floor(total / itemPiece);
                      const piece = total % itemPiece;
                      const minBox = Math.floor(minimumStock / itemPiece);
                      const minPiece = minimumStock % itemPiece;

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-black px-2 py-2">{item.item_name}</td>
                          <td className="border border-black px-2 py-2 text-right">{item.item_category}</td>
                          {item.item_size !== undefined && <td className="hidden print:table-cell border border-black px-2 py-2 text-right">{item.item_size}</td>}
                          
                          {singlebranch !== doublebranch ? (
                            <>
                              <td className="border border-black px-2 py-2 text-right">{minimumStock}</td>
                              <td className="border border-black px-2 py-2 text-right text-red-600 font-bold">{total}</td>
                            </>
                          ) : (
                            <>
                              <td className="border border-black px-2 py-2 text-center">{minBox}</td>
                              <td className="border border-black px-2 py-2 text-center">{minPiece}</td>
                              <td className="border border-black px-2 py-2 text-center text-red-600 font-bold">{box}</td>
                              <td className="border border-black px-2 py-2 text-center text-red-600 font-bold">{piece}</td>
                            </>
                          )}
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No stock data available.</div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default StockTableBoth;
