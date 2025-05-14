import { BrowserRouter } from "react-router-dom";
import Layouts from "./layouts/Layout";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/RecurringAPI";

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
