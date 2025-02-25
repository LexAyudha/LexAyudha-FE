import { BrowserRouter } from "react-router-dom";
import Layouts from "./layouts/Layout";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  
  return (
    <div className="page-container">
    <BrowserRouter>
      <Layouts />
    </BrowserRouter>
  </div>
  )
}

export default App
