import React from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 || // first page
          i === totalPages || // last page
          (i >= currentPage - 1 && i <= currentPage + 1) // neighbors
        ) {
          pages.push(i);
        } else if (
          (i === currentPage - 2 && currentPage > 3) ||
          (i === currentPage + 2 && currentPage < totalPages - 2)
        ) {
          pages.push("...");
        }
      } 
    return (
        <div className='pagination'>
            <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            >
            <FaChevronLeft/>
            </button>
            {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="dots">…</span>
        ) : (
          <button
            key={idx}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
        <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FaChevronRight/>
      </button>
        </div>
    )
}

export default Pagination