import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { loginRequest } from "../../apis/auth";
import fullLogo from "../../assets/images/fullLogo.png";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (loginSuccess: LoginResponse) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      setLoading(false);
      setError("");
    };
  }, []);

  const login = useGoogleLogin({
    onError: () => {
      setError("Unable to login");
    },
    onSuccess: async (codeResponse) => {
      try {
        const loginSuccess = await loginRequest(codeResponse);
        onLoginSuccess(loginSuccess);
        onClose();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    redirect_uri: "http://localhost:4000",
    flow: "auth-code",
  });

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Box textAlign="end">
            <FontAwesomeIcon onClick={onClose} icon={faXmark} cursor="pointer" />
          </Box>
          <Text fontSize="2xl" mb={5}>
            Sign in to
          </Text>
          <Box>
            <Image src={fullLogo} height={30} width={192} margin="auto" />
          </Box>
        </ModalHeader>
        <ModalBody textAlign="center">
          <Text fontSize="xl" mb={10}>
            Log in to join your interview session.
          </Text>
          <Button
            padding={0}
            mb="4"
            onClick={() => {
              setLoading(true);
              login();
            }}
          >
            {loading ? (
              <Spinner size="lg" />
            ) : (
              <>
                <Flex background={"#4285f4"} height="100%" textAlign={"center"} width="40px" marginRight={5}>
                  <i className="fa-brands fa-google" style={{ margin: "auto" }}></i>
                </Flex>
                <Text marginRight={2}>Sign in with Google</Text>
              </>
            )}
          </Button>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
