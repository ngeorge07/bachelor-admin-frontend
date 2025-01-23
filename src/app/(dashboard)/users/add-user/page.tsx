"use client";

import {
  Button,
  Fieldset,
  Input,
  Flex,
  Heading,
  HStack,
  RadioGroup,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Formik, Form } from "formik";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Radio } from "@/components/ui/radio";

enum Role {
  SuperAdmin = "superAdmin",
  Admin = "admin",
}

type FormData = {
  email: string;
  password: string;
  fullName: string;
  roles: string;
};

type ErrorData = {
  email: string;
  password: string;
  fullName: string;
  roles: string;
};

export default function AddRemark() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const token = getCookie("token");

  const initialValues: FormData = {
    email: "",
    password: "",
    fullName: "",
    roles: Role.Admin,
  };

  const validate = (values: FormData) => {
    const errors: Partial<ErrorData> = {};

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

    if (!values.fullName) {
      errors.password = "Please enter a password.";
    }

    if (!values.roles || values.roles.length === 0) {
      errors.roles = "Please assign at least one role.";
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
            fetch(`http://localhost:3000/api/auth/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
                fullName: values.fullName,
                roles: [values.roles],
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
                router.push(`/users`);
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
                  label="Email address"
                  invalid={!!errors.email}
                  errorText={errors.email}
                >
                  <Input
                    name="email"
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

                <Field
                  required
                  label="Full name"
                  invalid={!!errors.fullName}
                  errorText={errors.fullName}
                  autoCapitalize="none"
                >
                  <Input
                    name="fullName"
                    value={values.fullName}
                    onChange={(text) => {
                      handleChange("fullName")(text);
                      if (errors.fullName) {
                        errors.fullName = undefined;
                      }
                    }}
                  />
                </Field>

                <Field
                  required
                  label="Role"
                  invalid={!!errors.roles}
                  errorText={errors.roles}
                  autoCapitalize="none"
                >
                  <RadioGroup.Root
                    value={values.roles}
                    onValueChange={(e) => {
                      handleChange("roles")(e.value);
                      if (errors.roles) {
                        errors.roles = undefined;
                      }
                    }}
                  >
                    <HStack gap="6">
                      <Radio value={Role.Admin}>Admin</Radio>
                      <Radio value={Role.SuperAdmin}>Super Admin</Radio>
                    </HStack>
                  </RadioGroup.Root>
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
