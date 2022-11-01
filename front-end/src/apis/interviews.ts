export const fetchAllInterviews: () => Promise<InterviewSession[]> = async () => {
  // call api
  return [
    {
      Name: "Javascript Interview",
      Date: Date.now().toString(),
      Room: "aasdf23rjsadkjla",
      Attendees: ["Tuna", "Cheese"],
    },
    { Name: "Go Interview", Date: Date.now().toString(), Room: "asdf23rjsadkjla", Attendees: ["Tuna", "Cheese"] },
  ];
};

export const createInterview: (payload: CreateInterviewRequest) => Promise<InterviewSession> = async (
  payload: CreateInterviewRequest
) => {
  const res = await fetch("/api/create-calendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("potential_token")}`,
    },
    body: JSON.stringify(payload),
    mode: "cors",
  });
  const data: InterviewSession = await res.json();
  if (res.ok) {
    return data;
  }
  throw Error("Unable to create event");
};
