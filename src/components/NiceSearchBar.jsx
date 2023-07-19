import { useEffect, useRef, useState } from "react";
import data from "../config/data/categories.data.json";
import { BiSearch, BiX } from "react-icons/bi";

const NiceSearchBar = ({ className }) => {
  const searchInputRef = useRef(null);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const filteredStuff = data.categories.filter((x) => x.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowResults(query !== "");
  };
  const handleClearSearch = () => setSearchQuery("");
  useEffect(() => {
    let searchInputRefValue = null;
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsSearchBarFocused(true);
        searchInputRef && searchInputRef.current.focus();
      } else if (event.key === "Escape") {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current.blur();
          setIsSearchBarFocused(false);
        }
      }
    };

    const handleSearchBarFocus = () => setIsSearchBarFocused(true);
    const handleSearchBarBlur = () => setIsSearchBarFocused(false);
    document.addEventListener("keydown", handleKeyDown);
    if (searchInputRef.current) searchInputRefValue = searchInputRef.current;
    searchInputRef.current.addEventListener("focus", handleSearchBarFocus);
    searchInputRef.current.addEventListener("blur", handleSearchBarBlur);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      searchInputRefValue?.removeEventListener("focus", handleSearchBarFocus);
      searchInputRefValue?.removeEventListener("blur", handleSearchBarBlur);
    };
  }, [isSearchBarFocused]);

  return (
    <form className={className}>
      <div className="relative">
        <input
          ref={searchInputRef}
          className="block w-full px-3 py-2 pl-10 pr-10 sm:pr-28 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
          placeholder="What you want to read?"
          value={searchQuery}
          onChange={handleSearchChange}
          required
        />
        <div className="absolute p-2 right-0 top-0 bottom-0 mr-4 hidden sm:block">
          <div className="border border-[#999] text-[#999] w-full h-full flex flex-col justify-center px-2 text-sm rounded-md">
            {isSearchBarFocused ? "ESC" : "CTRL + K"}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 ">
          {searchQuery !== "" ? (
            <BiX className="text-xl text-[#999] cursor-pointer z10" onClick={handleClearSearch} />
          ) : (
            <BiSearch className="text-xl text-[#999]" />
          )}
        </div>
      </div>
      {searchQuery !== "" && (
        <div className="absolute  w-full left-0 md:left-auto top-14  md:top-16 md:w-[350px]  border border-[#222] z-10 ">
          <div className="max-w-7xl text-sm md:text-base mx-auto bg-black">
            <ul className="py-2">
              {filteredStuff.length > 0 ? (
                filteredStuff.map((book) => (
                  <li key={book.name} className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white">
                    {book.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-white">No item found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
};

export default NiceSearchBar;
