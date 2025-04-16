const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-[#1F2937]/80 backdrop-blur-md text-[#E5E7EB] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
      <h1 className="text-lg sm:text-xl font-bold tracking-wide text-center sm:text-left w-full sm:w-auto">
        Todo
      </h1>
    </header>
  );
};

export default Header;
