"use client";

import {
  Button,
  Fieldset,
  Input,
  Flex,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  message: string;
  trainNumber: string;
};

export default function AddRemark() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const token = getCookie("token");

  const initialValues: FormData = {
    title: "",
    message: "",
    trainNumber: "",
  };

  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};

    // Title validation
    if (!values.title) {
      errors.title = "Please enter a title.";
    } else if (values.title.length > 70) {
      errors.title = "Title cannot be longer than 70 characters.";
    }

    // Message validation
    if (!values.message) {
      errors.message = "Please enter a message.";
    } else if (values.message.length > 200) {
      errors.message = "Message cannot be longer than 200 characters.";
    }

    if (!values.trainNumber) {
      errors.trainNumber = "Please enter a train number.";
    }

    return errors;
  };

  return (
    <>
      <Heading mb={5}>Add train remark</Heading>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values: FormData) => {
          {
            fetch(`http://localhost:3000/api/remarks/${values.trainNumber}/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title: values.title,
                message: values.message,
              }),
            })
              .then(async (response) => {
                if (!response.ok) {
                  return response.json().then((errorData) => {
                    setUnauthorizedError(true);
                    setError(`Server error! Message: ${errorData.message}`);
                    throw new Error(
                      `Server error! Message: ${errorData.message}`,
                    );
                  });
                }

                return response.json();
              })
              .then(() => {
                router.push(`/dashboard/remarks`);
                console.log("Response:", "remark was successfully added");
              })
              .catch((error) => {
                console.error("Error:", error.message);
              });
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, handleChange, values }) => (
          <Form noValidate>
            <Fieldset.Root
              p={6}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="lg"
              maxW="md"
              invalid={unauthorizedError}
            >
              <Fieldset.Content>
                <Field
                  required
                  label="Train number"
                  invalid={!!errors.trainNumber}
                  errorText={errors.trainNumber}
                >
                  <Input
                    name="trainNumber"
                    value={values.trainNumber}
                    onChange={(text) => {
                      handleChange("trainNumber")(text);
                      if (errors.trainNumber) {
                        errors.trainNumber = undefined;
                      }
                    }}
                  />
                </Field>

                <Field
                  required
                  label="Remark title"
                  invalid={!!errors.title}
                  errorText={errors.title}
                  autoCapitalize="none"
                >
                  <Input
                    name="title"
                    value={values.title}
                    onChange={(text) => {
                      handleChange("title")(text);
                      if (errors.title) {
                        errors.title = undefined;
                      }
                    }}
                  />
                </Field>

                <Field
                  required
                  label="Message"
                  invalid={!!errors.message}
                  errorText={errors.message}
                  autoCapitalize="none"
                >
                  <Textarea
                    name="message"
                    value={values.message}
                    onChange={(text) => {
                      handleChange("message")(text);
                      if (errors.message) {
                        errors.message = undefined;
                      }
                    }}
                  />
                </Field>
              </Fieldset.Content>

              <Flex justifyContent="space-between" mt={4}>
                <Button
                  variant="subtle"
                  colorPalette="red"
                  onClick={() => router.push("/dashboard/remarks")}
                >
                  Cancel
                </Button>
                <Button variant="subtle" colorPalette="blue" type="submit">
                  Submit
                </Button>
              </Flex>

              <Fieldset.ErrorText>{error}</Fieldset.ErrorText>
            </Fieldset.Root>
          </Form>
        )}
      </Formik>
    </>
  );
}
