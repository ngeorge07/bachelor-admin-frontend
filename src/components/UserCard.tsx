import { Text, Button, HStack, Stack, Card } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { UserInterface } from "@/interfaces/User";
import { getCookie } from "cookies-next";

export default function UserCard({
  user,
  loadUsers,
}: {
  user: UserInterface;
  loadUsers: () => Promise<void>;
}) {
  const deleteUser = async (userId: string) => {
    const token = getCookie("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the remark");
      }

      await loadUsers();
    } catch (error) {
      console.error("Error deleting remark:", error);
    }
  };

  return (
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
              Role: {user?.roles[0] === "superAdmin" ? "super admin" : "admin"}
            </Text>
          </Stack>
        </HStack>
      </Card.Body>
      <Card.Footer flexDirection="column" gap={5}>
        <Button
          variant="subtle"
          colorPalette="red"
          w="full"
          onClick={() => deleteUser(user._id)}
        >
          <LuX />
          Delete Account
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
