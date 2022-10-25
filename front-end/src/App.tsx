import { Box, ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Landing from "./pages/Landing";
import { Navbar } from "./shared/components/Navbar";
import { CLIENT_ID } from "./shared/constants/auth";

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
