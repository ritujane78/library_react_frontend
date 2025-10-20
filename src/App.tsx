import React from "react";
import {useNavigate} from 'react-router-dom';
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";

import { LibraryServices } from "./layouts/Homepage/components/LibraryServices";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Homepage } from "./layouts/Homepage/Homepage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";

import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

import { auth0Config } from './lib/auth0Config';
import LoginPage from './Auth/LoginPage';
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";

import RequireAuth from "./RequireAuth";
import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";


const Auth0ProviderWithHistory = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || "/home", { replace: true });
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }} 
       onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Auth0ProviderWithHistory>
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />}></Route>
          <Route path="/home" element={<Homepage />}></Route>
          <Route path="/search" element={<SearchBooksPage />}></Route>
          <Route path="/checkout/:bookid" element={<BookCheckoutPage />}></Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/reviewList/:bookid" element={<ReviewListPage />} />

          <Route path="/shelf" element={<RequireAuth><ShelfPage /></RequireAuth>}      />
          <Route path="/messages" element={<RequireAuth><MessagesPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><ManageLibraryPage /></RequireAuth>} />
        </Routes>
      </div>
      <Footer />
      </Auth0ProviderWithHistory>
    </div>
  );
};
