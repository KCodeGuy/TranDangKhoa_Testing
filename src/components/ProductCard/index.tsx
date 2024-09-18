import React from "react";
import "~/components/ProductCard/styles.scss";
import { Product } from "~/types/Product";

interface ProductCardProps {
  product: Product;
  isLastItem: boolean;
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isLastItem }, ref) => {
    return (
      <div
        ref={ref}
        className="card-item"
        id={isLastItem ? "last-product" : undefined}
      >
        {product.thumbnail ? (
          <img
            className="card-img"
            loading="lazy"
            src={product.thumbnail}
            alt={product.title}
          />
        ) : (
          <div className="card-img-load" />
        )}

        <div className="card-body">
          <h2 className="card-title">{product.title}</h2>
          <p className="card-price">${product.price} USD</p>
        </div>
      </div>
    );
  }
);
