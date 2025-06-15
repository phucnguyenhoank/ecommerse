import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Sidebar, { FilterOptions } from "../components/Sidebar";
import Pagination from "../components/Pagination";
import ProductList from "../components/ProductList";
import FilteredProductList from "../components/FilteredProductList";
import "../styles/Swimwear.css";

const SwimwearPage = () => {
  const { category } = useParams(); // nếu bạn dùng /swimwear/:category sau này
  const categoryIdsToUse = [2]; // Swimwear ID từ database của bạn

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<FilterOptions>({});
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

  // Reset filter khi category trên URL thay đổi
  useEffect(() => {
    setFilters({});
    setIsFiltering(false);
  }, [category]);

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
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <button className="filter-btn" onClick={handleClearFilters}>
                Delete Filter
              </button>
            </div>
          )}

          <div className="clothing-wrapper">
            {isFiltering ? (
              <FilteredProductList
                filters={filters}
                parentCategoryId={2}
                allowedSubcategoryIds={[20, 21]}
                page={page}
                limit={limit}
                onTotalCountChange={setTotalCount}
              />
            ) : (
              <ProductList
                categoryIds={[2,13,14]}
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

export default SwimwearPage;
