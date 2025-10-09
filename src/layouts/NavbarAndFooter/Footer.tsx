export const Footer = () =>{
    return (
        <div className="main-color">
            <footer className="container d-flex flex-wrap justify-content-between
            align-items-center py-5 main-color" >
                <p className="col-md-4 mb-0 text-white">&copy; Example Library App, Inc</p>
                <ul className="nav navbar-dark col-md-6 justify-content-end">
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white px-4">
                            Home
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white px-4">
                            Search Books
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    );
}