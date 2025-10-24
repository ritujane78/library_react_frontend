import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useAuth0 } from "@auth0/auth0-react";

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: any }> = (props) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const {getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    const fetchBookInState = () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };

    fetchBookInState();
  }, []);

  async function increaseQuantity() {
        const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    async function decreaseQuantity() {
        const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }
    const deleteBook = async () => {
        const url = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props.book?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);
        if (!updateResponse.ok) {
            throw new Error('Something went wrong!');
        }

        props.deleteBook();

    }

  return (
    <div className="card shadow mt-3 mb-3 p-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {props.book?.img ? (
              <img src={props.book?.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book?.img ? (
              <img src={props.book?.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">{props.book.description}</p>
          </div>
        </div>
        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-start">
            <button onClick={deleteBook} className="m-1 btn btn-md btn-danger">Delete</button>
          </div>
        </div>
        <button onClick={increaseQuantity} className="m1 btn btn-md main-color text-white">
          Add Quantity
        </button>
        <button onClick={decreaseQuantity} className="m1 btn btn-md btn-warning">Decrease Quantity</button>
      </div>
    </div>
  );
};
