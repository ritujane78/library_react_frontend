import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

import { LibraryServices } from './layouts/Homepage/components/LibraryServices';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/Homepage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';

export const App = () => {
  return (
    <div>
      <Navbar />
      {/* <Homepage /> */}
      <SearchBooksPage />
      <Footer />
    </div>

  );
}
