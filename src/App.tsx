import React from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";

import { LibraryServices } from "./layouts/Homepage/components/LibraryServices";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Homepage } from "./layouts/Homepage/Homepage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { Navigate, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />}></Route>
          <Route path="/home" element={<Homepage />}></Route>
          <Route path="/search" element={<SearchBooksPage />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
