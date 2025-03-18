import { BrowserRouter } from "react-router-dom";
import Layouts from "./layouts/Layout";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  
  return (
    <div className="flex justify-center ">
    <BrowserRouter>
      <Layouts />
    </BrowserRouter>
  </div>
  )
}

export default App
