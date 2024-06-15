import React from "react";

const Pagination = ({ currentPage, totalPages, onChangePage }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map(page => (
        <span
          key={page}
          className={`page-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => onChangePage(page)}
        >
          {page}
        </span>
      ))}
    </div>
  );
};

export default Pagination;
