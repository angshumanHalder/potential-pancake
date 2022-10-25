import { Avatar, Box, Button, Flex, HStack, Image, Link, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fullLogo from "../../assets/images/fullLogo.png";
import { googleLogout } from "@react-oauth/google";
import { SignInModal } from "../auth/Signin";
import { logoutRequest } from "../../apis/auth";

const Links = [{ label: "Home", link: "/home" }];

export const Navbar: React.FC<{}> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<{ Picture: string; GivenName: string } | null>(null);
  const token = localStorage.getItem("potential_token");
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    const profileData: LoginResponse | null = profile ? JSON.parse(profile) : null;
    setProfile(profileData);
    return () => {
      setProfile(null);
    };
  }, []);

  useEffect(() => {
    console.log("useeffct", token);
    !token && navigate("/", { replace: true });
  }, [token]);

  const onLoginSuccess = (loginData: LoginResponse) => {
    const profile = {
      Picture: loginData.Picture,
      GivenName: loginData.GivenName,
    };
    setProfile(profile);
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("potential_token", loginData.Token);
    navigate("/home", { replace: true });
  };

  const logoutHandler = async () => {
    await logoutRequest();
    localStorage.removeItem("profile");
    localStorage.removeItem("potential_token");
    setProfile(null);
    googleLogout();
  };

  return (
    <Box bg={useColorModeValue("gray.900", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Image src={fullLogo} height={30} width={192} />
        </Box>
        <Box>
          {profile ? (
            <HStack spacing={8} alignItems={"center"}>
              <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                {Links.map((link) => (
                  <Link key={link.link} href={link.link}>
                    {link.label}
                  </Link>
                ))}
              </HStack>
              <Flex alignItems={"center"}>
                <Menu>
                  <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar src={profile.Picture} name={profile.GivenName} size="sm" />
                  </MenuButton>
                  <MenuList onClick={logoutHandler}>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HStack>
          ) : (
            <Text color="yellow" onClick={onOpen} role="button">
              Sign In
            </Text>
          )}
        </Box>
      </Flex>
      <SignInModal isOpen={isOpen} onClose={onClose} onLoginSuccess={onLoginSuccess} />
    </Box>
  );
};
