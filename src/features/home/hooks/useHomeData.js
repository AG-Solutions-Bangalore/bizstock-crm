import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import usetoken from "@/api/usetoken";
import { getTodayDate } from "@/utils/currentDate";
import { fetchDashboardData, fetchStockData } from "../services/homeService";
import { MONTHS } from "../forms/homeConstants";

export const useHomeData = () => {
  const token = usetoken();
  const currentDate = getTodayDate();
  const now = new Date();
  
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCategoryZero, setSelectedCategoryZero] = useState("All Categories");
  const [categories, setCategories] = useState(["All Categories"]);
  const [brands, setBrands] = useState(["All Brands"]);
  const [selectedBrands, setSelectedBrands] = useState("All Brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryZero, setSearchQueryZero] = useState("");
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);

  const {
    data: dashboardStock,
    isLoading: isLoadingDashboard,
    isError: isErrorDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["dashboardData", selectedYear, selectedMonth],
    queryFn: () => fetchDashboardData(token, `${selectedMonth} ${selectedYear}`),
  });

  const {
    data: stockData,
    isFetching: isLoadingStock,
    isError: isErrorStock,
    refetch: refetchStock,
  } = useQuery({
    queryKey: ["stockData"],
    queryFn: () => fetchStockData(token, "2024-01-01", currentDate),
  });

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const uniqueCategories = [...new Set(stockData.map((item) => item.item_category))];
      const uniqueBrands = [...new Set(stockData.map((item) => item.item_brand))];
      
      const sortedBrands = uniqueBrands
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      const sortedCategories = uniqueCategories
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      setBrands(["All Brands", ...sortedBrands]);
      setCategories(["All Categories", ...sortedCategories]);
    }
  }, [stockData]);

  const filteredItems = stockData?.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item?.item_name?.toLowerCase().includes(searchLower) ||
      item?.item_category?.toLowerCase().includes(searchLower) ||
      item?.item_size?.toLowerCase().includes(searchLower);

    const matchesCategory = selectedCategory === "All Categories" || item.item_category === selectedCategory;
    const matchesBrand = selectedBrands === "All Brands" || item.item_brand === selectedBrands;

    return matchesSearch && matchesBrand && matchesCategory;
  }) || [];

  const filteredItemsZero = (stockData || []).filter((item) => {
    const searchLower = searchQueryZero.toLowerCase();
    const matchesSearch =
      item?.item_name?.toLowerCase().includes(searchLower) ||
      item?.item_category?.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategoryZero === "All Categories" || item.item_category === selectedCategoryZero;

    return matchesSearch && matchesCategory;
  });

  const handleDateChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    refetchDashboard();
  };

  return {
    token,
    currentDate,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryZero,
    setSelectedCategoryZero,
    categories,
    brands,
    selectedBrands,
    setSelectedBrands,
    searchQuery,
    setSearchQuery,
    searchQueryZero,
    setSearchQueryZero,
    selectedYear,
    selectedMonth,
    dashboardStock,
    isLoadingDashboard,
    isErrorDashboard,
    refetchDashboard,
    stockData,
    isLoadingStock,
    isErrorStock,
    refetchStock,
    filteredItems,
    filteredItemsZero,
    handleDateChange,
  };
};
