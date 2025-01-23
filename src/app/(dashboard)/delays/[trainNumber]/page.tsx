"use client";

import { Button, Fieldset, Input, Flex, Heading } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = {
  delay: string;
};

export default function EditDelay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ trainNumber: string }>();
  const delay = searchParams.get("delay");

  const [error, setError] = useState<string | null>(null);

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const token = getCookie("token");

  const initialValues: FormData = {
    delay: delay || "",
  };

  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};

    if (values.delay === "" || parseInt(values.delay) < 0) {
      errors.delay = "Please enter a delay.";
    }

    return errors;
  };

  return (
    <>
      <Heading mb={5}>Edit train delay</Heading>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values: FormData) => {
          {
            fetch(
              `http://localhost:3000/api/trip/delays/${params.trainNumber}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  delay: parseInt(values.delay || "0"),
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
                router.push(`/remarks`);
                console.log("Response:", "delay was successfully edited");
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
                <Field label="Train number" disabled>
                  <Input name="title" placeholder={params.trainNumber} />
                </Field>

                <Field
                  required
                  label="Delay"
                  invalid={!!errors.delay}
                  errorText={errors.delay}
                  autoCapitalize="none"
                >
                  <Input
                    name="delay"
                    type="number"
                    value={values.delay}
                    onChange={(text) => {
                      handleChange("delay")(text);
                      if (errors.delay) {
                        errors.delay = undefined;
                      }
                    }}
                  />
                </Field>
              </Fieldset.Content>

              <Flex justifyContent="space-between" mt={4}>
                <Button
                  variant="subtle"
                  colorPalette="red"
                  onClick={() => router.push("/remarks")}
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
