export const fetchAllInterviews: () => Promise<InterviewSession[]> = async () => {
  // call api
  return [
    {
      Name: "Javascript Interview",
      Date: Date.now().toString(),
      Room: "aasdf23rjsadkjla",
      Attendees: ["Tuna", "Cheese"],
    },
    {
      Name: "Go Interview",
      Date: Date.now().toString(),
      Room: "asdf23rjsadkjla",
      Attendees: ["Tuna", "Cheese"],
    },
  ];
};
