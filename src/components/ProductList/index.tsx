import React, { useState, useCallback, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import "~/components/ProductList/styles.scss";
import { ProductCard } from "~/components/ProductCard";
import { SearchItems } from "~/components/SearchItem";
import { getAllProducts, searchProducts } from "~/services/ProductService";

const LIMIT_ITEMS = 20;

export const ProductList = () => {
  const [txtSearch, setTxtSearch] = useState<string>("");
  const [showScrollUp, setShowScrollUp] = useState<boolean>(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["products", txtSearch],
      async ({ pageParam = 0 }) => {
        return txtSearch
          ? searchProducts(txtSearch)
          : getAllProducts(LIMIT_ITEMS, pageParam);
      },
      {
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length < LIMIT_ITEMS
            ? undefined
            : allPages.length * LIMIT_ITEMS,
      }
    );

  const handleSearchProducts = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTxtSearch(event.target.value);
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && hasNextPage && !isFetchingNextPage) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        });
        observer.observe(node);

        // Clean up observer
        return () => {
          observer.disconnect();
        };
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return (
    <section className="product-wrapper">
      <div className="product-header">
        <p className="product-title">Product list</p>
        <SearchItems
          txtSearch={txtSearch}
          onSearchChange={handleSearchProducts}
        />
      </div>

      <div className="product-list">
        {isLoading ? (
          <p className="product-message">Loading...</p>
        ) : (
          data?.pages.map((page, pageIndex) =>
            page.map((product, index) => (
              <div
                key={product.id}
                ref={index === page.length - 1 ? loadMoreRef : null}
              >
                <ProductCard
                  product={product}
                  isLastItem={
                    index === page.length - 1 &&
                    pageIndex === data.pages.length - 1
                  }
                />
              </div>
            ))
          )
        )}

        {!isLoading && !hasNextPage && !isFetchingNextPage && (
          <p className="product-message">Không có sản phẩm</p>
        )}
      </div>

      <div
        className={`scroll-up-button ${showScrollUp ? "show" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </div>
    </section>
  );
};
