export const SpinnerLoading = () => {
    return (
    <div className="container d-flex justify-content-center m-5" style={{height: 550}}>
        <div className="spinner-border text-primary">
            <span className="visually-hidden">
                Loading...
            </span>
        </div>
    </div>
    );
}