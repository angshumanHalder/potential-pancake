import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "../../shared/components/Navbar";
import landing from "../../assets/images/landing.jpg";

const Landing = () => {
  return (
    <>
      <Box mb={5}>
        <Navbar />
      </Box>
      <Box bg={"#262625"} px={10} mb={20}>
        <Flex alignItems={"center"} justifyContent={"space-between"} padding={20}>
          <Text fontSize="80px">Simple Interview Portal</Text>
          <Image src={landing} width={700} height={500} />
        </Flex>
      </Box>
      <Text pt={6} fontSize={"sm"} textAlign={"center"}>
        Pancake made with <FontAwesomeIcon icon={faHeart} color="red" fill="red" /> by Angshuman. © 2022.
      </Text>
    </>
  );
};

export default Landing;
