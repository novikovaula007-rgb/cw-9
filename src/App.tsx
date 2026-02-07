import { Container } from "@mui/material";
import {Route, Routes } from "react-router-dom";
import NotFoundPage from "../src/containers/NotFoundPage/NotFoundPage.tsx";
import Transactions from "./containers/Transactions/Transactions.tsx";
import Categories from "./containers/Categories/Categories.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";

const App = () => {
  return (
      <>
        <NavBar/>
        <Container sx={{margin: '90px auto'}} maxWidth={"sm"}>
          <Routes>
            <Route path='/' element={(<Transactions/>)}/>
            <Route path='/transactions' element={(<Transactions/>)}/>
            <Route path='/categories' element={(<Categories/>)}/>
            <Route path='*' element={(<NotFoundPage/>)}/>
          </Routes>
        </Container>
      </>
  )
}

export default App
