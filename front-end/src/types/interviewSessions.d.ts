interface InterviewSession {
  Name: string;
  Room: string;
  StartDateTime: number;
  endDateTime: number;
  Attendees: Array<string>;
}

interface CreateInterviewRequest {
  name: string;
  startDateTime: string;
  endDateTime: string;
  attendees: Array<string>;
  timeZone: string;
}
