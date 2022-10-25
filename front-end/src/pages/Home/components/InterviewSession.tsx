import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { convertUTCToTZDate } from "../../../utils/date";

interface InterviewSessionProps {
  session: InterviewSession;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ session }) => {
  return (
    <Box>
      <VStack alignItems={"left"} padding={5}>
        <HStack justifyContent={"space-between"}>
          <Text fontSize={"xl"}>{session.Name}</Text>
          <Text fontSize={"md"}>On: {convertUTCToTZDate(session.Date)}</Text>
        </HStack>
        <Divider />
        <HStack justifyContent={"space-between"}>
          <Text fontSize={"lg"}>Attendees</Text>
          <Box>
            <Button size={"sm"} mr={2} colorScheme={"yellow"}>
              Add to Calendar
            </Button>
            <Button size={"sm"} colorScheme={"orange"}>
              Join
            </Button>
          </Box>
        </HStack>
        <HStack>
          {session.Attendees.map((attendee) => (
            <Text fontSize={"md"} key={attendee}>
              {attendee}
            </Text>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
