import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useAuth0 } from "@auth0/auth0-react";
import RequestReviewModel from "../../models/RequestReviewModel";

export const BookCheckoutPage = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState("");
  const bookId = window.location.pathname.split("/")[2];

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  // Is Book Check Out?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  useEffect(() => {
    const fetchReviewsForABook = async () => {
      const reviewUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

      const response = await fetch(reviewUrl);

      if (!response.ok) {
        throw new Error("Something went wrong with getting reviews");
      }
      const responseJson = await response.json();

      const responseData = responseJson._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];
      let weightedReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          book_id: responseData[key].bookId,
          rating: responseData[key].rating,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedReviews = totalStars + responseData[key].rating;
      }
      if (loadedReviews) {
        const round = (
          Math.round((weightedReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }
      setReviews(loadedReviews);
      setIsLoadingReviews(false);
    };
    fetchReviewsForABook().catch((error: any) => {
      setIsLoadingReviews(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }
      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };
      setBook(loadedBook);
      setIsLoading(false);
    };

    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (isAuthenticated) {
        // const url = `${process.env.REACT_APP_API}/api/reviews/secure/user/book/?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}&userEmail=${user?.email}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [bookId, isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count?userEmail=${user?.email}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
        // console.log(accessToken);
      }
      setIsLoadingCurrentLoansCount(false);
    };
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated, getAccessTokenSilently, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (isAuthenticated) {
        // const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}&userEmail=${user?.email}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const bookCheckedOut = await fetch(url, requestOptions);

        if (!bookCheckedOut.ok) {
          throw new Error("Something went wrong!");
        }

        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [bookId, isAuthenticated, getAccessTokenSilently]);

  if (
    isLoading ||
    isLoadingReviews ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book?.id;
    }
    const reviewRequestModel: RequestReviewModel = new RequestReviewModel(
      starInput,
      bookId,
      reviewDescription
    );

    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const accessToken = await getAccessTokenSilently();

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    setIsReviewLeft(true);
  }

  async function checkoutBook() {
    // const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
    const accessToken = await getAccessTokenSilently();
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsCheckedOut(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row m-5">
          <div className="col-sm-3 col-md-2">
            {book?.img ? (
              <img src={book.img} height="349" width="226" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                height="349"
                width="226"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <div className="col-md-4">
            <CheckoutAndReviewBox
              book={book}
              mobile={false}
              currentLoansCount={currentLoansCount}
              isAuthenticated={isAuthenticated}
              isCheckedOut={isCheckedOut}
              checkoutBook={checkoutBook}
              isReviewLeft={isReviewLeft}
              submitReview={submitReview}
            />
          </div>
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book.img} height="349" width="226" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              height="349"
              width="226"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
