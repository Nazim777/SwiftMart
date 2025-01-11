import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => onPageChange(i)}
          className="px-3 py-1 mx-1"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        disabled={isFirstPage}
        onClick={handlePrevious}
        className="px-4 py-2"
      >
        Previous
      </Button>
      <div className="flex items-center">{renderPageNumbers()}</div>
      <Button
        variant="outline"
        disabled={isLastPage}
        onClick={handleNext}
        className="px-4 py-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
