import { Helmet } from "react-helmet-async";

const handleRefresh = () => {
  window.location.reload();
};

const ErrorBoundaryUI = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <Helmet>
        <title>iChatAI Error Boundary: something went wrong.</title>
      </Helmet>
      <img
        className="p-4 w-2/5 max-md:w-5/6 max-sm:w-full"
        src="/error.svg"
        alt="something went wrong"
        loading="lazy"
      />
      <h1 className="text-2xl leading-10 font-bold mb-4 uppercase max-sm:text-[1.2rem] w-full text-center">
        Something went wrong.
      </h1>
      <button
        className="w-max h-max text-white rounded-[3rem] bg-human flex gap-4 items-center px-4 py-2 border-none outline-none hover:outline-clr1 focus:outline-clr1 focus:border-white transition-all text-base"
        type="button"
        onClick={handleRefresh}
      >
        Refresh Page
      </button>
    </div>
  );
  // }
};

export default ErrorBoundaryUI;
