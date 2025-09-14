"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formUrlQuery } from "@/utils/utils";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  urlParamName?: string;
};

export default function PaginationCustom({
  currentPage,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const generatePageNumbers = () => {
    const pages = [];

    // Always include the first page
    pages.push(1);

    // Left ellipsis if necessary
    if (currentPage > 3) {
      pages.push("ellipsis-left");
    }

    // Page before current
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    // Current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    // Page after current
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }

    // Right ellipsis if necessary
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-right");
    }

    // Always include the last page if there are multiple pages
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const generatUrl = (pageValue: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                const pageValue = currentPage - 1;
                generatUrl(pageValue);
              }
            }}
            href="#"
          />
        </PaginationItem>
        {/* Page Numbers */}
        {pageNumbers.map((page, index) =>
          page === "ellipsis-left" ? (
            <PaginationItem key={`ellipsis-left-${index}`}>
              <PaginationEllipsis
                onClick={() => {
                  const pageValue = Math.max(1, currentPage - 3);
                  generatUrl(pageValue);
                }}
                className="cursor-pointer hover:bg-gray-100"
              />
            </PaginationItem>
          ) : page === "ellipsis-right" ? (
            <PaginationItem key={`ellipsis-right-${index}`}>
              <PaginationEllipsis
                onClick={() => {
                  const pageValue = Math.min(totalPages, currentPage + 3);
                  generatUrl(pageValue);
                }}
                className="cursor-pointer hover:bg-gray-100"
              />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  const pageValue = Number(page);
                  generatUrl(pageValue);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                const pageValue = currentPage + 1;
                generatUrl(pageValue);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
