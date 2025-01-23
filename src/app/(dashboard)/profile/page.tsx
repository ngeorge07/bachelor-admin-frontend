"use client";

import { Heading, Text, Button, HStack, Stack, Card } from "@chakra-ui/react";
import { AuthContext } from "@/app/context/AuthContext";
import { useContext } from "react";
import { LuX, LuDoorOpen } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function Profile() {
  const { onSignOutSuccess, authState } = useContext(AuthContext);
  const user = authState?.userData;

  const router = useRouter();

  return (
    <>
      <Heading mb={5}>User profile</Heading>

      <Card.Root width="320px">
        <Card.Body>
          <HStack gap="3">
            <Stack gap="0">
              <Text fontWeight="semibold" textStyle="lg">
                {user?.fullName}
              </Text>
              <Text color="fg.muted" textStyle="sm">
                Email: {user?.email}
              </Text>
              <Text color="fg.muted" textStyle="sm">
                Role:{" "}
                {user?.roles[0] === "superAdmin" ? "super admin" : "admin"}
              </Text>
            </Stack>
          </HStack>
        </Card.Body>
        <Card.Footer flexDirection="column" gap={5}>
          <Button
            as="a"
            variant="subtle"
            colorPalette="blue"
            w="full"
            onClick={() => {
              deleteCookie("token");
              onSignOutSuccess();
              router.push(`/signin`);
            }}
          >
            <LuDoorOpen />
            Log out
          </Button>

          <Button
            variant="subtle"
            colorPalette="red"
            w="full"
            // onClick={() => deleteRemark(trainNumber, messageId)}
          >
            <LuX />
            Delete Account
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
