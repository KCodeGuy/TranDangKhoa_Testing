import React, { useEffect, useRef, useState, useCallback } from "react";
import "~/components/ProductList/styles.scss";
import { ProductCard } from "~/components/ProductCard";
import { SearchItems } from "~/components/SearchItem";
import { Product } from "~/types/Product";
import { getAllProducts, searchProducts } from "~/services/ProductService";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [txtSearch, setTxtSearch] = useState<string>("");
  const [showScrollUp, setShowScrollUp] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LIMIT_ITEMS = 20;

  const showNextProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newProducts = await getAllProducts(LIMIT_ITEMS, skip);
      if (newProducts.length < LIMIT_ITEMS) {
        setHasMore(false);
      }
      setProducts((prev) => [...prev, ...newProducts]);
      setSkip((prev) => prev + LIMIT_ITEMS);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, skip, hasMore]);

  const handleSearchProducts = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setTxtSearch(query);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        if (query.trim()) {
          try {
            const searchResults = await searchProducts(query);
            setProducts(searchResults);
            setSkip(0);
            setHasMore(searchResults.length === LIMIT_ITEMS);
          } catch (error) {
            console.error("Search failed:", error);
          }
        } else {
          handleClearSearch();
        }
      }, 500);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setTxtSearch("");
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    showNextProducts();
  }, [showNextProducts]);

  const handleScroll = useCallback(() => {
    setShowScrollUp(window.scrollY > 300);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    showNextProducts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (loading || !hasMore) return;

    const lastProduct = document.querySelector("#last-product");
    if (!lastProduct) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        showNextProducts();
      }
    });

    observer.current.observe(lastProduct);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, showNextProducts]);

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
        {products?.length > 0
          ? products.map((product, index) => (
              <ProductCard
                key={product.id}
                isLastItem={index === products.length - 1}
                product={product}
              />
            ))
          : ""}
      </div>

      {products?.length <= 0 && !loading ? (
        <p className="product-message">Không tìm thấy sản phẩm!</p>
      ) : null}

      {loading && <p className="product-message">Loading...</p>}

      <button
        className={`scroll-up-button ${showScrollUp ? "show" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </section>
  );
};
