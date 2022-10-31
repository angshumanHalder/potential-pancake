import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateInterview } from "./pages/CreateInterview";
import { Home } from "./pages/Home";
import Landing from "./pages/Landing";
import { CLIENT_ID } from "./shared/constants/auth";

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateInterview />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
