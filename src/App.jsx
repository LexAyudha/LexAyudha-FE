import { BrowserRouter } from "react-router-dom";
import Layouts from "./layouts/Layout";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";


// Create a configured QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120 * 60 * 1000, // 2 hours
      cacheTime: 120 * 60 * 1000, // 2 hours
    },
  },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center ">
        <BrowserRouter>
          <Layouts />
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
