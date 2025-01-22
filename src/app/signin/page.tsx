"use client";

import { Button, Fieldset, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { Center } from "@chakra-ui/react";
import { useAuth } from "@/app/context/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
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

  const { login, user } = useAuth();

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
          try {
            await login(values.email, values.password);
            resetForm();
            alert("Login successful");
            console.log("user " + user);
          } catch (e) {
            // console.log(e);
            alert("Login failes");
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
                      if (errors.email) {
                        errors.email = undefined;
                      }
                    }}
                  />
                </Field>
              </Fieldset.Content>

              <Button type="submit" alignSelf="flex-start" mt={4}>
                Submit
              </Button>
            </Fieldset.Root>
          </Form>
        )}
      </Formik>
    </Center>
  );
}
