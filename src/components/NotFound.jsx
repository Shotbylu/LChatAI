import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <Helmet>
        <title>iChatAI 404: Page not found.</title>
      </Helmet>
      <img
        className="p-4 w-2/5 max-md:w-5/6 max-sm:w-full"
        src="/404-page.svg"
        alt="404-Page not found"
        loading="lazy"
      />
      <h1 className="text-2xl leading-10 font-bold mb-4">PAGE NOT FOUND</h1>
      <button
        className="w-max h-max text-white rounded-[3rem] bg-human flex gap-4 items-center px-4 py-2 border-none outline-none hover:outline-clr1 focus:outline-clr1 focus:border-white transition-all text-base"
        onClick={handleBackToPreviousPage}
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
