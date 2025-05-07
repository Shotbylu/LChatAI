import ChatBox from "./components/ChatBox";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryUI from "./components/ErrorBoundaryUi";
import NotFound from "./components/NotFound";
import { HelmetProvider } from "react-helmet-async";

const consoleErrorBoundary = (error) => {
  console.log(`Error caught by Error Boundary: ${error}`);
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/chats"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorBoundaryUI}
                onError={consoleErrorBoundary}
              >
                <ChatBox />
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
