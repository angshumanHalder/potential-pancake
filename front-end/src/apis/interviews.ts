export const fetchAllInterviews: () => Promise<InterviewSession[]> = async () => {
  const res = await fetch("/api/get-events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("potential_token")}`,
    },
    mode: "cors",
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  }
  throw Error("Unable to fetch events");
};

export const createInterview: (payload: CreateInterviewRequest) => Promise<InterviewSession> = async (
  payload: CreateInterviewRequest
) => {
  const res = await fetch("/api/create-event", {
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

export const cancelInterview = async (payload: { Room: string }) => {
  console.log("called", payload);
  await fetch("/api/cancel-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("potential_token")}`,
    },
    body: JSON.stringify(payload),
    mode: "cors",
  });
};
