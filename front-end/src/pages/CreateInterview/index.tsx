import { Layout } from "../../shared/components/Layout";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { DatePicker } from "../../shared/components/DateTimePicker/DateTimePicker";

const CreateInterviewSchema = Yup.object().shape({
  interviewerEmail: Yup.string().required("Email required").email(),
  intervieweeEmail: Yup.string().required("Email required").email(),
  startDateTime: Yup.date().required("Start Date required"),
  endDateTime: Yup.date().required("End Date required"),
});

const initialValues = {
  interviewerEmail: "",
  intervieweeEmail: "",
  startDateTime: "",
  endDateTime: "",
};

export const CreateInterview: React.FC<{}> = () => {
  return (
    <Layout>
      <Formik initialValues={initialValues} validationSchema={CreateInterviewSchema} onSubmit={handleSumit}>
        {({ errors, touched }) => {
          return (
            <Form>
              <FormControl mb={5} isInvalid={!!errors.interviewerEmail}>
                <FormLabel htmlFor="interviewerEmail">Interviewer Email</FormLabel>
                <Field id="interviewerEmail" name="interviewerEmail" as={Input} type="email" />
                {touched.interviewerEmail && errors.interviewerEmail && (
                  <FormErrorMessage>{errors.interviewerEmail}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.intervieweeEmail}>
                <FormLabel htmlFor="intervieweeEmail">Interviewee Email</FormLabel>
                <Field id="intervieweeEmail" name="intervieweeEmail" as={Input} type="email" />
                {touched.intervieweeEmail && errors.intervieweeEmail && (
                  <FormErrorMessage>{errors.intervieweeEmail}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.startDateTime}>
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
                {touched.startDateTime && errors.startDateTime && (
                  <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={5} isInvalid={!!errors.endDateTime}>
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
                {touched.endDateTime && errors.endDateTime && <FormErrorMessage>{errors.endDateTime}</FormErrorMessage>}
              </FormControl>
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
}) {
  console.log(values);
}
