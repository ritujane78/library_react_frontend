import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";

export const ManageLibraryPage = () => {
    const {isAuthenticated, getAccessTokenSilently, user, getIdTokenClaims} = useAuth0();

    const[roles, setRoles] = useState<String[] | null>(null);
    const [loading, setLoading] = useState(true); 


    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClicked] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

        useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['https://jane-react-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false); 
        };

        fetchRoles();
    }, [getIdTokenClaims]);

    const addBooks = () => {
        setChangeQuantityOfBooksClicked(false);
        setMessagesClick(false);
    }

    const changeQauntity = () => {
        setChangeQuantityOfBooksClicked(true);
        setMessagesClick(false);
    }

    const messagesFunc = () => {
        setChangeQuantityOfBooksClicked(false);
        setMessagesClick(true);
    }
    if (loading) {
        return (<SpinnerLoading />) 
    }

    if (!roles?.includes('admin')) { 
        return <Navigate to='/home'/>
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={ addBooks} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                        aria-selected="false">
                            Add new Book
                        </button>
                        <button onClick={ changeQauntity} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                        aria-selected="true">
                            Change Quantity
                        </button>
                        <button onClick={messagesFunc} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                        aria-selected="false">
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                    aria-labelledby="#nav-add-book-tab">
                        <AddNewBook />
                    </div>
                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel"
                    aria-labelledby="#nav-quantity-tab">
                        {changeQuantityOfBooksClick ? <>Change Quantity</> : <></>}
                    </div>
                    <div className="tab-pane fade " id="nav-messages" role="tabpanel"
                    aria-labelledby="#nav-messages-tab">
                        {messagesClick ? <AdminMessages /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}