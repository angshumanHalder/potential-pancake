interface InterviewSession {
  Name: string;
  Room: string;
  Date: string;
  Attendees: Array<string>;
}

interface CreateInterviewRequest {
  name: string;
  startDateTime: string;
  endDateTime: string;
  attendees: Array<string>;
  timeZone: string;
}
