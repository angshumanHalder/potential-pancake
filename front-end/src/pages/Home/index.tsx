import { Alert, AlertIcon, AlertTitle, Box, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchAllInterviews } from "../../apis/interviews";
import { Layout } from "../../shared/components/Layout";
import { InterviewSession } from "./components/InterviewSession";

export const Home = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<InterviewSession[]>([]);
  const [error, setError] = useState<string>("");
  const value = useColorModeValue("gray.800", "gray.600");

  const fetchData = async () => {
    try {
      const data = await fetchAllInterviews();
      setUpcomingSessions(data);
    } catch (err) {
      setError("Unable to fetch upcoming sessions");
    }
  };

  useEffect(() => {
    fetchData();
  }, [upcomingSessions]);

  return (
    <Layout>
      <Box borderRadius={"sm"} boxShadow="2xl">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {!error && upcomingSessions?.length > 0 ? (
          upcomingSessions.map((session) => {
            return (
              <Box mb={10} borderRadius={"10px"} bg={value} key={session.Room}>
                <InterviewSession session={session} />
              </Box>
            );
          })
        ) : (
          <Box textAlign={"center"} padding="20px" borderRadius={"10px"} bg={value}>
            <Text fontSize="lg">No Upcoming Interview Sessions</Text>
          </Box>
        )}
      </Box>
    </Layout>
  );
};
