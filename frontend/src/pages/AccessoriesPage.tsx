import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar, { FilterOptions } from "../components/Sidebar";
import ProductList from "../components/ProductList";
import FilteredProductList from "../components/FilteredProductList";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import "../styles/AccessoriesPage.css";

// Ánh xạ tên category con sang ID
const mapCategoryToId = (category: string): number | null => {
  const map: Record<string, number> = {
    jewelry: 9,
    shoesandbags: 10,
  };
  return map[category.toLowerCase()] ?? null;
};


const accessoriesCategoryIds = [3, 9, 10];

const AccessoriesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<FilterOptions>({ category: "Accessories" });
  const { category } = useParams(); // nếu dùng /accessories/:category
  const categoryIdFromUrl = category ? mapCategoryToId(category) : null;

 
  const categoryIdsToUse =
    categoryIdFromUrl !== null ? [categoryIdFromUrl] : accessoriesCategoryIds;

  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFiltering(true);
    setPage(1);
  };
  const handleClearFilters = () => {
    setFilters({});
    setIsFiltering(false);
    setPage(1);
  };
  const totalPages = Math.ceil(totalCount / limit);



  useEffect(() => {
    setFilters({});
    setIsFiltering(false);
  }, [category]);

  if (category && categoryIdFromUrl === null) {
    return (
      <main className="accessories-page">
        <Breadcrumb title="Accessories" />
        <p style={{ padding: 24 }}>No matching categories found.</p>
      </main>
    );
  }

  return (
    <main className="swimwear-page">
      <Breadcrumb title="Swimwear" />
      <div className="content-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          allowedCategories={["Swimwear"]}
        />
        <div className="right-content">
          {isFiltering && (
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <button className="filter-btn" onClick={handleClearFilters}>
                Delete Filter
              </button>
            </div>
          )}

          <div className="clothing-wrapper">
            {isFiltering ? (
              <FilteredProductList
                filters={filters}
                parentCategoryId={3}
                allowedSubcategoryIds={[9, 10]}
                page={page}
                limit={limit}
                onTotalCountChange={setTotalCount}
              />
            ) : (
              <ProductList
                categoryIds={categoryIdsToUse} 
                page={page}
                limit={limit}
                onTotalCountChange={setTotalCount}
              />
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};


export default AccessoriesPage;
