import React from "react";

import "~/components/SearchItem/styles.scss";

interface SearchItemsProps {
  txtSearch: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch?: () => void;
}

export const SearchItems = ({
  txtSearch,
  onSearchChange,
}: SearchItemsProps) => {
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Product's name..."
        value={txtSearch}
        onChange={onSearchChange}
      />
    </div>
  );
};
