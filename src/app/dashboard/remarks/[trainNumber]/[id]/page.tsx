"use client";

import {
  Button,
  Fieldset,
  Input,
  Flex,
  Heading,
  Textarea,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  message: string;
};

export default function EditRemark() {
  const router = useRouter();
  const params = useParams<{ trainNumber: string; id: string }>();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    const fetchRemarkData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/remarks/${params.trainNumber}/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch the remark.");
        }

        const data = await response.json();

        // Assuming the API response has the title and message fields
        setTitle(data.title); // Save title value
        setMessage(data.message); // Save message value
      } catch (error) {
        setError("Failed to load the remark.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarkData();
  }, [params.trainNumber, params.id, token]);

  const initialValues: FormData = {
    title: title,
    message: message,
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

    return errors;
  };

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Heading mb={5}>Edit train remark</Heading>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values: FormData) => {
          {
            fetch(
              `http://localhost:3000/api/remarks/${params.trainNumber}/${params.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  title: values.title,
                  message: values.message,
                }),
              },
            )
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
                console.log("Response:", "remark was successfully edited");
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
