import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [httpError, setHttpErrr] = useState(null);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  useEffect(() => {
    const fetchUserCurrrentLoans = async () => {
      if (isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans?userEmail=${user?.email}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong.");
        }

        const shelfCurrentLoansResponseJson = await response.json();
        setShelfCurrentLoans(shelfCurrentLoansResponseJson);
      }
      setIsLoadingUserLoans(false);
    };

    fetchUserCurrrentLoans().catch((error: any) => {
      setHttpErrr(error.message);
      setIsLoadingUserLoans(false);
    });
    window.scrollTo(0, 0);
  }, [isAuthenticated, getAccessTokenSilently, isCheckedOut]);

  if (isLoadingUserLoans) {
    <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const returnBook= async (bookId: number) => {
    const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(!isCheckedOut);
  }
  async function renewLoan(bookId: number) {
        const url = `${process.env.REACT_APP_API}/books/secure/renew/loan?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(!isCheckedOut);
    }
  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2 ">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans: </h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id} className="container mt-4">
                <div className="row">
                  {/* Book Image */}
                  <div className="col-8 col-md-8 ">
                    {shelfCurrentLoan?.book.img ? (
                      <img
                        src={shelfCurrentLoan?.book.img}
                        width="226"
                        height="349"
                        alt="Book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        height="349"
                        width="226"
                        alt="Book"
                      />
                    )}
                  </div>
                  <div className="col-4 col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="mt-3">
                          <h4>Loan Options</h4>
                          {shelfCurrentLoan.daysLeft > 0 && (
                            <p className="text-secondary">
                              Due in {shelfCurrentLoan.daysLeft} days.
                            </p>
                          )}
                          {shelfCurrentLoan.daysLeft === 0 && (
                            <p className="text-success">Due today.</p>
                          )}
                          {shelfCurrentLoan.daysLeft < 0 && (
                            <p className="text-danger">
                              Past due by {Math.abs(shelfCurrentLoan.daysLeft)}{" "}
                              days.
                            </p>
                          )}
                          <div className="list-group mt-3">
                            <button
                              className="list-group-item list-group-item-action"
                              aria-current="true"
                              data-bs-toggle="modal"
                              data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                            >
                              Manage Loan
                            </button>
                            <Link
                              to={"search"}
                              className="list-group-item list-group-item-action"
                            >
                              Search more books?
                            </Link>
                          </div>
                        </div>
                        <hr />
                        <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false} 
                        returnBook={returnBook} renewBook={renewLoan}/>
                        <p className="mt-3">
                          Help others find their adventure by reviewing your
                          loan.
                        </p>
                        <Link
                          className="btn btn-primary"
                          to={`/checkout/${shelfCurrentLoan.book.id}`}
                        >
                          Leave a review.
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans.</h3>
            <Link className="btn btn-primary" to={`search`}>
              Search for a new book.
            </Link>
          </>
        )}
      </div>
      {/* Mobile */}
      <div className="container d-lg-none mt-2 ">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className='mb-3'>Current Loans: </h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id} className="container mt-4">
                  {/* Book Image */}
                  <div className="d-flex justify-content-center align-items-center">
                    {shelfCurrentLoan?.book.img ? (
                      <img
                        src={shelfCurrentLoan?.book.img}
                        width="226"
                        height="349"
                        alt="Book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        height="349"
                        width="226"
                        alt="Book"
                      />
                    )}
                  </div>
                  <div>
                    <div className="card d-flex mt-5 mb-3">
                      <div className="card-body conainer">
                        <div className="mt-3">
                          <h4>Loan Options</h4>
                          {shelfCurrentLoan.daysLeft > 0 && (
                            <p className="text-secondary">
                              Due in {shelfCurrentLoan.daysLeft} days.
                            </p>
                          )}
                          {shelfCurrentLoan.daysLeft === 0 && (
                            <p className="text-success">Due today.</p>
                          )}
                          {shelfCurrentLoan.daysLeft < 0 && (
                            <p className="text-danger">
                              Past due by {Math.abs(shelfCurrentLoan.daysLeft)}{" "}
                              days.
                            </p>
                          )}
                          <div className="list-group mt-3">
                            <button
                              className="list-group-item list-group-item-action"
                              aria-current="true"
                              data-bs-toggle="modal"
                              data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                            >
                              Manage Loan
                            </button>
                            <Link
                              to={"search"}
                              className="list-group-item list-group-item-action"
                            >
                              Search more books?
                            </Link>
                          </div>
                        </div>
                        <hr />
                        <p className="mt-3">
                          Help others find their adventure by reviewing your
                          loan.
                        </p>
                        <Link
                          className="btn btn-primary"
                          to={`/checkout/${shelfCurrentLoan.book.id}`}
                        >
                          Leave a review.
                        </Link>
                      </div>
                    </div>
                  </div>
                
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true} 
                returnBook={returnBook} renewBook={renewLoan} />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans.</h3>
            <Link className="btn btn-primary" to={`search`}>
              Search for a new book.
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
