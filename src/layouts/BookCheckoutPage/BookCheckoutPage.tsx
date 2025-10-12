import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState("");
  const bookId = window.location.pathname.split("/")[2];

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviewsForABook = async () => {
      const reviewUrl = `http://localhost:8081/api/reviews/search/findByBookId?bookId=${bookId}`;
  
      const response = await fetch(reviewUrl);

      if(!response.ok){
        throw new Error('Something went wrong with getting reviews');
      }
      const responseJson = await response.json();

      const responseData = responseJson._embedded.reviews;

      const loadedReviews : ReviewModel[] = [];
      let weightedReviews: number = 0;

      for(const key in responseData){
        loadedReviews.push({
          id:responseData[key].id,
          userEmail: responseData[key].userEmail,
          date:responseData[key].date,
          book_id: responseData[key].bookId,
          rating: responseData[key].rating,
          reviewDescription: responseData[key].reviewDescription
        });
        weightedReviews = totalStars + responseData[key].rating;
      }
      if(loadedReviews){
        const round = (Math.round((weightedReviews/loadedReviews.length) * 2) / 2).toFixed(1);
        setTotalStars(Number(round));
      }
      setReviews(loadedReviews);
      setIsLoadingReviews(false);
    }  
    fetchReviewsForABook().catch((error: any) => {
      setIsLoadingReviews(false);
      setHttpError(error.message);
    })

  }, [])

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl = `http://localhost:8081/api/books/${bookId}`;

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
  }, []);

  if (isLoading || isLoadingReviews) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
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
            <CheckoutAndReviewBox book={book} mobile={false} />
          </div>
        </div>
      </div>
      <hr />
      <LatestReviews reviews={reviews} bookId={book?.id} mobile= {false} />
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
        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile= {true} />
      </div>
    </div>
  );
};
