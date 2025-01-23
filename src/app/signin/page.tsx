"use client";

import { Button, Fieldset, Input, Stack, Spinner } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { Center } from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const { onSignInSuccess, authState } = useContext(AuthContext);
  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state to show spinner while checking auth state

  useEffect(() => {
    // Redirect if the user is authenticated
    if (authState.isAuthenticated) {
      router.push("/remarks"); // Redirect to home if authenticated
    }
    setLoading(false); // Mark loading as false when the auth state is ready
  }, [authState.isAuthenticated, router]);

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const initialValues: FormData = {
    email: "",
    password: "",
  };

  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};

    // Email validation
    if (!values.email) {
      errors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Please enter a password.";
    } else if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(values.password)) {
      errors.password =
        "Password must be at least 6 characters, include one uppercase letter and one number.";
    }

    return errors;
  };

  return (
    <Center
      minHeight="100vh"
      bg="gray.subtle"
      paddingInline={7}
      lg={{ paddingInline: 0 }}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values: FormData, { resetForm }) => {
          {
            fetch("http://localhost:3000/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                email: values.email,
                password: values.password,
              }),
            })
              .then(async (response) => {
                if (!response.ok) {
                  return response.json().then((errorData) => {
                    // Display an error if the user doesn't exist or the password is wrong
                    setUnauthorizedError(true);
                    throw new Error(
                      `Server error! Message: ${errorData.message}`,
                    );
                  });
                }

                return response.json();
              })
              .then((data) => {
                setCookie("token", data.access_token, { secure: true });

                // Run the callback from the auth context to check if the cookie token in still valid
                onSignInSuccess();

                // remove error if the login was successful
                setUnauthorizedError(false);
                resetForm();
                console.log("Response:", "login was successful");
                router.push("/remarks");
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
              <Stack mb={4}>
                <Fieldset.Legend fontSize="lg">Sign in</Fieldset.Legend>
                <Fieldset.HelperText>
                  Use your crendentials to sign in. If you don&apos;t have an
                  account contact the administrator.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content>
                <Field
                  required
                  label="Email address"
                  invalid={!!errors.email}
                  errorText={errors.email}
                  autoCapitalize="none"
                >
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(text) => {
                      handleChange("email")(text);
                      if (errors.email) {
                        errors.email = undefined;
                      }
                    }}
                  />
                </Field>

                <Field
                  required
                  label="Password"
                  invalid={!!errors.password}
                  errorText={errors.password}
                  autoCapitalize="none"
                >
                  <Input
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={(text) => {
                      handleChange("password")(text);
                      if (errors.password) {
                        errors.password = undefined;
                      }
                    }}
                  />
                </Field>
              </Fieldset.Content>

              <Button type="submit" alignSelf="flex-start" mt={4}>
                Submit
              </Button>

              <Fieldset.ErrorText>
                Incorrect credentials. Please try again.
              </Fieldset.ErrorText>
            </Fieldset.Root>
          </Form>
        )}
      </Formik>
    </Center>
  );
}
