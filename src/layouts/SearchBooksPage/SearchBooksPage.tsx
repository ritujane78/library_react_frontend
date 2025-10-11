import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import BookModel from "../../models/BookModel";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [searchUrl, setSearchUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySelection, setCatgorySelection] = useState("Book category");

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      const baseUrl = "http://localhost:8081/api/books";

      let url = "";
      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`)
        url = baseUrl + searchWithPage;
      }
      console.log(url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }
      const responseJson = await response.json();

      const responseData = responseJson._embedded.books;
      

      setTotalAmountOfBooks(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }
      setBooks(loadedBooks);
      setIsLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem: number =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleSearchChange = () => {
    setCurrentPage(1);
    if (searchQuery === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${searchQuery}&page=<pageNumber>&size=${booksPerPage}`
      );
    }
    setCatgorySelection('Book Ccategory');
  };
  const categoryField = (value: string) => {
    setCurrentPage(1);
    if(value.toLowerCase() ==='fe' ||
        value.toLowerCase() === 'be' ||
        value.toLowerCase() === 'data' ||
        value.toLowerCase() === 'devops'
    ){
        setCatgorySelection(value);
        setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
    }else {
        setCatgorySelection("All");
        setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
    }

  }
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  type="search"
                  className="form-control me-2"
                  placeholder="Search"
                  aria-labelledby="search"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleSearchChange()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  id="dropdownButton1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {categorySelection}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownButton1">
                  <li onClick={() => categoryField('All')}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryField('FE')}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryField('BE')}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryField('Data')}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryField('DevOps')}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of Results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {" "}
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{" "}
                items
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you're looking for?</h3>
              <a
                type="button"
                href="#"
                className="btn btn-md main-color px-4 me-md-2 text-white fw-bold"
              >
                Library Services
              </a>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
