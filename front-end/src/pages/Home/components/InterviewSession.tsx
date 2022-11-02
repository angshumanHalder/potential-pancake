import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { cancelInterview } from "../../../apis/interviews";
import { convertUTCEpochToDate } from "../../../utils/date";

interface InterviewSessionProps {
  session: InterviewSession;
  onCancel: () => void;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ session, onCancel }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <VStack alignItems={"left"} padding={5}>
        <HStack justifyContent={"space-between"}>
          <Text fontSize={"xl"}>{session.Name}</Text>
          <Text fontSize={"md"}>
            On: <Text as="b">{convertUTCEpochToDate(session.StartDateTime)}</Text>
          </Text>
        </HStack>
        <Divider />
        <HStack justifyContent={"space-between"}>
          <Text fontSize={"lg"}>Attendees</Text>
          <Box>
            <Button size={"sm"} ml={2} colorScheme={"orange"} onClick={() => navigate(`/room/${session.Room}`)}>
              Join
            </Button>
            <Button size={"sm"} ml={2} colorScheme={"red"} onClick={() => onCancel()}>
              Cancel
            </Button>
          </Box>
        </HStack>
        <HStack>
          {session.Attendees.map((attendee) => (
            <Text fontSize={"md"} key={attendee} as="b">
              {attendee}
            </Text>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
