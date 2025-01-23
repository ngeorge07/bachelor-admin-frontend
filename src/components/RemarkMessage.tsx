import { Card, Button, Text, Stack, HStack } from "@chakra-ui/react";
import { LuX, LuPencil } from "react-icons/lu";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function RemarkMessage({
  title,
  message,
  created_by,
  createdAt,
  updatedAt,
  trainNumber,
  messageId,
  loadRemarks,
}: {
  title: string;
  message: string;
  created_by: string;
  createdAt: string;
  updatedAt?: string;
  trainNumber: string;
  messageId: string;
  loadRemarks: () => Promise<void>;
}) {
  const router = useRouter();

  const deleteRemark = async (trainNumber: string, messageId: string) => {
    const token = getCookie("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/remarks/${trainNumber}/${messageId}`,
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

      await loadRemarks();
    } catch (error) {
      console.error("Error deleting remark:", error);
    }
  };

  const formattedDate = format(
    new Date(updatedAt ? updatedAt : createdAt),
    "dd/MM/yyyy 'at' HH:mm",
  );

  return (
    <Card.Root width="320px">
      <Card.Body>
        <HStack mb="6" gap="3">
          <Stack gap="0">
            <Text fontWeight="semibold" textStyle="sm">
              {title}
            </Text>
            <Text color="fg.muted" textStyle="sm">
              Created by {created_by}
            </Text>
            <Text color="fg.muted" textStyle="sm">
              Updated at {formattedDate}
            </Text>
          </Stack>
        </HStack>

        <Card.Description>{message}</Card.Description>
      </Card.Body>
      <Card.Footer>
        <Button
          variant="subtle"
          colorPalette="red"
          flex="1"
          onClick={() => deleteRemark(trainNumber, messageId)}
        >
          <LuX />
          Delete
        </Button>
        <Button
          as="a"
          variant="subtle"
          colorPalette="blue"
          flex="1"
          onClick={() => {
            router.push(`/remarks/${trainNumber}/${messageId}`);
          }}
        >
          <LuPencil />
          Edit
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
