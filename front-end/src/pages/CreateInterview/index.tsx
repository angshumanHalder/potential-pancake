import { Layout } from "../../shared/components/Layout";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { DatePicker } from "../../shared/components/DateTimePicker/DateTimePicker";
import { createInterview } from "../../apis/interviews";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateInterviewSchema = Yup.object().shape({
  interviewerEmail: Yup.string().required("Email required").email(),
  intervieweeEmail: Yup.string().required("Email required").email(),
  startDateTime: Yup.date().required("Start Date required"),
  endDateTime: Yup.date().required("End Date required"),
  eventName: Yup.string().required("Event name required"),
});

const initialValues = {
  interviewerEmail: "",
  intervieweeEmail: "",
  startDateTime: "",
  endDateTime: "",
  eventName: "",
};

export const CreateInterview: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={CreateInterviewSchema}
        onSubmit={async (values) => {
          try {
            await handleSumit(values);
            navigate("/home");
          } catch (err: any) {
            setError("Unable to create event");
          }
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <FormControl mb={5} isInvalid={!!errors.eventName && touched.eventName}>
                <FormLabel htmlFor="eventName">Event Name</FormLabel>
                <Field id="eventName" name="eventName" as={Input} type="text" />
                {touched.eventName && errors.eventName && <FormErrorMessage>{errors.eventName}</FormErrorMessage>}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.interviewerEmail && touched.interviewerEmail}>
                <FormLabel htmlFor="interviewerEmail">Interviewer Email</FormLabel>
                <Field id="interviewerEmail" name="interviewerEmail" as={Input} type="email" />
                {errors.interviewerEmail && <FormErrorMessage>{errors.interviewerEmail}</FormErrorMessage>}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.intervieweeEmail && touched.intervieweeEmail}>
                <FormLabel htmlFor="intervieweeEmail">Interviewee Email</FormLabel>
                <Field id="intervieweeEmail" name="intervieweeEmail" as={Input} type="email" />
                {errors.intervieweeEmail && <FormErrorMessage>{errors.intervieweeEmail}</FormErrorMessage>}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.startDateTime && touched.startDateTime}>
                <FormLabel htmlFor="startDateTime">From</FormLabel>
                <Field id="startDateTime" name="startDateTime">
                  {({ field, form }: FieldProps) => {
                    return (
                      <DatePicker
                        onChange={(date) => form.setFieldValue("startDateTime", date, true)}
                        showTimeSelect
                        showPopperArrow={false}
                        selectedDate={field.value}
                        name="startDateTime"
                        dateFormat="dd/MM/yyyy hh:mm a"
                        minDate={new Date()}
                      />
                    );
                  }}
                </Field>
                {errors.startDateTime && <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.endDateTime && touched.endDateTime}>
                <FormLabel htmlFor="endDateTime">To</FormLabel>
                <Field id="endDateTime" name="endDateTime">
                  {({ field, form }: FieldProps) => {
                    return (
                      <DatePicker
                        onChange={(date) => form.setFieldValue("endDateTime", date, true)}
                        showTimeSelect
                        showPopperArrow={false}
                        selectedDate={field.value}
                        name="endDateTime"
                        dateFormat="dd/MM/yyyy hh:mm a"
                        minDate={new Date()}
                      />
                    );
                  }}
                </Field>
                {errors.endDateTime && <FormErrorMessage>{errors.endDateTime}</FormErrorMessage>}
              </FormControl>

              {error && (
                <Alert status="error" mb={5}>
                  <AlertIcon />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Button type="submit" width="100%" colorScheme={"yellow"}>
                Create Interview
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

async function handleSumit(values: {
  interviewerEmail: string;
  intervieweeEmail: string;
  startDateTime: string;
  endDateTime: string;
  eventName: string;
}): Promise<InterviewSession> {
  const payload: CreateInterviewRequest = {
    name: values.eventName,
    endDateTime: new Date(values.endDateTime).toISOString(),
    startDateTime: new Date(values.startDateTime).toISOString(),
    attendees: [values.interviewerEmail, values.intervieweeEmail],
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  console.log(payload);
  const data = await createInterview(payload);
  return data;
}
