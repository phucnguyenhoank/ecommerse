
// function Pagination(){
//     return (
//         <div className="pagination">
//             <a href="#">&laquo;
//             </a>
//             <a href="#" className="active">1</a>
//             <a href="#">2</a>
//             <a href="#">&laquo;
//             </a>
//         </div>
//     );
// }
// export default Pagination

import React from "react";
import "../styles/pagination.css";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <a href="#" className={page <= 1 ? "disabled" : ""} onClick={e => {
          e.preventDefault();
          if (page > 1) onChange(page - 1);
        }}
      >&laquo;
      </a>

      {pages.map(p => (
        <a key={p} href="#"
          className={p === page ? "active" : ""}
          onClick={e => {
            e.preventDefault();
            onChange(p);
          }}
        >
          {p}
        </a>
      ))}

      <a
        href="#" className={page >= totalPages ? "disabled" : ""} onClick={e => {
          e.preventDefault();
          if (page < totalPages) onChange(page + 1);
        }}
      >&raquo;
      </a>
    </div>
  );
}
