import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    //Pagination
    const [currentPage,setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split('/')[2];

  useEffect(() => {
    const fetchReviewsForABook = async () => {
      const reviewUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

      const response = await fetch(reviewUrl);

      if (!response.ok) {
        throw new Error("Something went wrong with getting reviews");
      }
      const responseJson = await response.json();

      const responseData = responseJson._embedded.reviews;
      setTotalAmountOfReviews(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loadedReviews: ReviewModel[] = [];

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          book_id: responseData[key].bookId,
          rating: responseData[key].rating,
          reviewDescription: responseData[key].reviewDescription,
        });
      }
      setReviews(loadedReviews);
      setIsLoading(false);
    };
    fetchReviewsForABook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if(isLoading){
    return (<SpinnerLoading />);
  }

  if(httpError){
    return (
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    );
  }
  const indexOfLastItem = currentPage * reviewsPerPage;
  const indexOfFirstItem = indexOfLastItem - reviewsPerPage;

  const lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

  const paginate = (pageNumber: number) => {setCurrentPage(pageNumber)};
  
    return (
        <div className="container m-5">
            <div>
                Comments ({reviews.length})
            </div>  
            <p>
                {indexOfFirstItem + 1} to {lastItem + 1} of {totalAmountOfReviews} reviews
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} /> 
                )
            )}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate = {paginate} />}
        </div>

    );
}