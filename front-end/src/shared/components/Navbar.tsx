import {
  Box,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  Image,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import fullLogo from "../../assets/images/fullLogo.png";

const Links = ["Dashboard", "Projects", "Team"];

interface NavbarProps {
  isSignedIn?: false;
}

export const Navbar: React.FC<NavbarProps> = ({ isSignedIn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderSignInModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Box textAlign="end">
              <FontAwesomeIcon onClick={onClose} icon={faXmark} />
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
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Image src={fullLogo} height={30} width={192} />
        </Box>
        <Box>
          {isSignedIn ? (
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <Link key={link} href={link}>
                  {link}
                </Link>
              ))}
            </HStack>
          ) : (
            <Text color="yellow" onClick={onOpen} role="button">
              Sign In
            </Text>
          )}
        </Box>
      </Flex>
      {renderSignInModal()}
    </Box>
  );
};
