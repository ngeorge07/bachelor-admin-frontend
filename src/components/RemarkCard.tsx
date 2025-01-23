import { Card, Flex, Badge } from "@chakra-ui/react";
import RemarkMessage from "@/components/RemarkMessage";
import { LuPencil } from "react-icons/lu";
import { Remark } from "@/interfaces/Remark";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export default function RemarkCard({
  remark,
  loadRemarks,
}: {
  remark: Remark;
  loadRemarks: () => Promise<void>;
}) {
  const router = useRouter();

  const [delay, setDelay] = useState(0);

  async function fetchDelay() {
    const token = getCookie("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/trip/delays/${remark.trainNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching remarks:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchDelay().then((data) => {
      setDelay(data.delay);
    });
  });

  return (
    <Card.Root overflow="hidden">
      <Card.Body gap="2">
        <Flex gap="2">
          <Card.Title>{remark.trainNumber}</Card.Title>
          {delay > 0 ? (
            <Badge
              cursor="pointer"
              as="button"
              colorPalette="red"
              onClick={() => {
                router.push(`/delays/${remark.trainNumber}?delay=${delay}`);
              }}
            >
              <LuPencil /> delayed {delay} min.{" "}
            </Badge>
          ) : (
            <Badge
              cursor="pointer"
              as="button"
              onClick={() => {
                router.push(`/delays/${remark.trainNumber}?delay=0`);
              }}
              colorPalette="green"
            >
              <LuPencil /> on time
            </Badge>
          )}
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" gap={5}>
          {remark.messages.map((message, index) => (
            <RemarkMessage
              key={index}
              title={message.title}
              message={message.message}
              created_by={message.createdBy}
              createdAt={message.createdAt}
              updatedAt={message.updatedAt}
              trainNumber={remark.trainNumber}
              messageId={message._id}
              loadRemarks={loadRemarks}
            />
          ))}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
