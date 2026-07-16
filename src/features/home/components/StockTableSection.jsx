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
import { setColumnVisibility } from "@/redux/columnVisibilitySlice";
import { ChevronDown, Download, Printer, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ColumnVisibilityDropdown from "./ColumnVisibilityDropdown";

function StockTableSection({
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
  const dispatch = useDispatch();
  const columnVisibility = useSelector((state) => state.columnVisibility);

  const hasPreBooking = filteredItems?.some(
    (item) => Number(item.pre_box) > 0 || Number(item.pre_piece) > 0,
  );

  const handleToggle = (key) => {
    const newVisibility = {
      ...columnVisibility,
      [key]: !columnVisibility[key],
    };
    const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
    const mainColumns = Object.keys(newVisibility).filter(
      (k) => k !== "box" && k !== "piece",
    );
    const isMainColumnSelected = mainColumns.some((k) => newVisibility[k]);

    if (!isMainColumnSelected) {
      toast({
        title: "Error",
        description: "At least one main column must be selected.",
        variant: "destructive",
      });
      return;
    }

    if (isDoubleBranch && (key === "box" || key === "piece")) {
      const boxVisible =
        key === "box" ? !columnVisibility.box : columnVisibility.box;
      const pieceVisible =
        key === "piece" ? !columnVisibility.piece : columnVisibility.piece;
      if (!boxVisible && !pieceVisible) {
        toast({
          title: "Error",
          description: "At least one of Box or Piece must be selected.",
          variant: "destructive",
        });
        return;
      }
    }

    if (isDoubleBranch) {
      if (key === "available_box" && !newVisibility[key]) {
        newVisibility.box = false;
        newVisibility.piece = false;
      }
      if (key === "available_box" && newVisibility[key]) {
        newVisibility.box = true;
      }
    }
    dispatch(setColumnVisibility(newVisibility));
  };

  const totals = filteredItems.reduce(
    (acc, item) => {
      if (singlebranch === "Yes" && doublebranch === "Yes") {
        const itemPiece = Number(item.item_piece) || 1;
        const total =
          Number(item.openpurch) * itemPiece +
          Number(item.openpurch_piece) -
          (Number(item.closesale) * itemPiece + Number(item.closesale_piece)) +
          (Number(item.purch) * itemPiece +
            Number(item.purch_piece) -
            (Number(item.sale) * itemPiece + Number(item.sale_piece)));

        acc.box += Math.floor(total / itemPiece);
        acc.piece += total % itemPiece;
        acc.pre_box += Number(item.pre_box) || 0;
        acc.pre_piece += Number(item.pre_piece) || 0;
      }
      return acc;
    },
    { box: 0, piece: 0, pre_box: 0, pre_piece: 0 },
  );

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="px-3 py-2 border-b">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-black">
              {title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-32 truncate">
                    <span className="truncate">{selectedCategory}</span>
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
                  align="start"
                >
                  {categories.map((category, index) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={() => setSelectedCategory(category)}
                    >
                      <span className="truncate">{category}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {title === "Stock View" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-32 truncate"
                    >
                      <span className="truncate">{selectedBrands}</span>
                      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
                    align="start"
                  >
                    {brands.map((brand) => (
                      <DropdownMenuItem
                        key={brand}
                        onSelect={() => setSelectedBrands(brand)}
                      >
                        <span className="truncate">{brand}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {print === "true" && (
                <button
                  className={`flex items-center justify-center w-full sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-2 rounded-lg`}
                  onClick={handlePrintPdf}
                >
                  <Printer className="h-4 w-4 mr-1" />
                </button>
              )}
              <button
                className={`flex items-center justify-center w-full sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-2 rounded-lg`}
                onClick={() => downloadCSV(filteredItems, toast)}
              >
                <Download className="h-4 w-4 mr-1" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                autoFocus
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-50 border-gray-200 w-full text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="w-full flex justify-end">
                <ColumnVisibilityDropdown
                  columnVisibility={columnVisibility}
                  singlebranch={singlebranch}
                  doublebranch={doublebranch}
                  handleToggle={handleToggle}
                />
              </div>
              <div className="text-sm text-gray-600 text-right sm:text-left w-full sm:w-auto">
                {filteredItems.length} items
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      ) : (
        <CardContent className="p-2">
          {filteredItems?.length ? (
            <div
              className="overflow-x-auto text-[11px] grid grid-cols-1 p-0 md:p-6 print:p-4"
              ref={containerRef}
            >
              <div className="hidden print:block">
                <div className="flex justify-between ">
                  <h1 className="text-left text-2xl font-semibold mb-3 ">
                    Stock Summary
                  </h1>
                  <div className="flex space-x-6">
                    <h1> From - 2024-01-01</h1>
                    <h1>To -{currentDate}</h1>
                  </div>
                </div>
              </div>

              <table className="w-full border border-black border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {columnVisibility.item_name && (
                      <th
                        className="border border-black px-2 py-2 text-center"
                        rowSpan={2}
                      >
                        Item Name
                      </th>
                    )}
                    {columnVisibility.category && (
                      <th
                        className="border border-black px-2 py-2 text-center"
                        rowSpan={2}
                      >
                        Category
                      </th>
                    )}
                    {columnVisibility.brand && (
                      <th
                        className="border border-black px-2 py-2 text-center"
                        rowSpan={2}
                      >
                        Brand
                      </th>
                    )}
                    {columnVisibility.size && (
                      <th
                        className="hidden print:table-cell border border-black px-2 py-2 text-center"
                        rowSpan={2}
                      >
                        Size
                      </th>
                    )}
                    {columnVisibility.available_box && (
                      <th
                        className="border border-black px-2 py-2 text-center"
                        colSpan={
                          singlebranch === "Yes" && doublebranch === "Yes"
                            ? 2
                            : 1
                        }
                      >
                        Available
                      </th>
                    )}
                    {hasPreBooking && (
                      <th className="border border-black px-2 py-2 text-center">
                        Pre booking
                      </th>
                    )}
                  </tr>
                  <tr>
                    {singlebranch === "Yes" &&
                      doublebranch === "Yes" &&
                      columnVisibility.available_box && (
                        <>
                          {columnVisibility.box && (
                            <th className="border border-black px-2 py-2 text-center">
                              Box
                            </th>
                          )}
                          {columnVisibility.piece && (
                            <th className="border border-black px-2 py-2 text-center">
                              Piece
                            </th>
                          )}
                        </>
                      )}
                    {hasPreBooking && (
                      <th className="border border-black px-2 py-2 text-center">
                        box/piece
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => {
                    const itemPiece = Number(item.item_piece) || 1;
                    const total =
                      Number(item.openpurch) * itemPiece +
                      Number(item.openpurch_piece) -
                      (Number(item.closesale) * itemPiece +
                        Number(item.closesale_piece)) +
                      (Number(item.purch) * itemPiece +
                        Number(item.purch_piece) -
                        (Number(item.sale) * itemPiece +
                          Number(item.sale_piece)));
                    const box = Math.floor(total / itemPiece);
                    const piece = total % itemPiece;

                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${item.pre_box > 0 || item.pre_piece > 0 ? "bg-pink-100" : ""}`}
                      >
                        {columnVisibility.item_name && (
                          <td className="border border-black px-2 py-2">
                            {item.item_name}
                          </td>
                        )}
                        {columnVisibility.category && (
                          <td className="border border-black px-2 py-2 text-right">
                            {item.item_category}
                          </td>
                        )}
                        {columnVisibility.brand && (
                          <td className="border border-black px-2 py-2 text-right">
                            {item.item_brand || "-"}
                          </td>
                        )}
                        {columnVisibility.size && (
                          <td className="hidden print:table-cell border border-black px-2 py-2 text-right">
                            {item.item_size}
                          </td>
                        )}

                        {columnVisibility.available_box &&
                          (singlebranch !== doublebranch ? (
                            <td
                              className={`border border-black px-2 py-2 text-right ${total === 0 ? "opacity-50" : ""}`}
                            >
                              {total}
                            </td>
                          ) : (
                            <>
                              {columnVisibility.box && (
                                <td
                                  className={`border border-black px-2 py-2 text-center ${box === 0 ? "opacity-50" : ""}`}
                                >
                                  {box}
                                </td>
                              )}
                              {columnVisibility.piece && (
                                <td
                                  className={`border border-black px-2 py-2 text-center ${piece === 0 ? "opacity-50" : ""}`}
                                >
                                  {piece}
                                </td>
                              )}
                            </>
                          ))}
                        {hasPreBooking && (
                          <td className="border border-black px-2 py-2 text-center">
                            {Number(item.pre_box) > 0 ||
                            Number(item.pre_piece) > 0
                              ? `${item.pre_box} / ${item.pre_piece}`
                              : ""}
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {(title === "Stock" || title === "Stock View") && (
                    <tr className="font-bold bg-gray-200">
                      <td
                        className="border border-black px-2 py-2 text-right"
                        colSpan={
                          [
                            columnVisibility.item_name,
                            columnVisibility.category,
                            columnVisibility.brand,
                          ].filter(Boolean).length
                        }
                      >
                        Total:
                      </td>
                      {columnVisibility.size && (
                        <td className="hidden print:table-cell border border-black px-2 py-2 text-right" />
                      )}
                      {columnVisibility.available_box &&
                        (singlebranch !== doublebranch ? (
                          <td className="border border-black px-2 py-2 text-right">
                            {totals.box}
                          </td>
                        ) : (
                          <>
                            {columnVisibility.box && (
                              <td className="border border-black px-2 py-2 text-center">
                                {totals.box}
                              </td>
                            )}
                            {columnVisibility.piece && (
                              <td className="border border-black px-2 py-2 text-center">
                                {totals.piece}
                              </td>
                            )}
                          </>
                        ))}
                      {hasPreBooking && (
                        <td className="border border-black px-2 py-2 text-center">
                          {totals.pre_box} / {totals.pre_piece}
                        </td>
                      )}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No stock data available.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default StockTableSection;
