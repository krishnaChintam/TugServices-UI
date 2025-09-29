const Loader = ({ show }) => {
    // If 'show' is false, render nothing
    if (!show) {
        return null;
    }

    // Render the loader centered on the screen
    return (
        <div 
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }} // Optional: adds a semi-transparent overlay
        >
            <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500 h-16 w-16"></div>
        </div>
    );
};

export default Loader;