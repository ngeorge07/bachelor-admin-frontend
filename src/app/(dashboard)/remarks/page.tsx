"use client";

import { useEffect, useState } from "react";
import {
  Heading,
  Text,
  Spinner,
  Box,
  Card,
  Flex,
  Button,
  Badge,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { Remark } from "@/interfaces/Remark";
import { useRouter } from "next/navigation";
import RemarkMessage from "@/components/RemarkMessage";
import { LuPencil } from "react-icons/lu";

// Define the fetch function
async function fetchRemarks() {
  const token = getCookie("token");

  try {
    const response = await fetch("http://localhost:3000/api/remarks/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

export default function Remarks() {
  const router = useRouter();
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRemarks = async () => {
    setLoading(true);
    try {
      const data = await fetchRemarks();
      setRemarks(data);
    } catch (error) {
      setError("Failed to load remarks");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemarks();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center">
        <Spinner size="lg" />
        <Text>Loading remarks...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <>
      <Flex mb={5} alignItems="center" justifyContent="space-between">
        <Heading>Train Remarks</Heading>
        <Button as="a" onClick={() => router.push("/remarks/add-remark")}>
          Add Remark
        </Button>
      </Flex>

      {remarks.length > 0 ? (
        <Flex direction="column" gap="4">
          {remarks.map((remark, index) => (
            <Card.Root key={index} overflow="hidden">
              <Card.Body gap="2">
                <Flex gap="2">
                  <Card.Title>{remark.trainNumber}</Card.Title>
                  {remark.delay > 0 ? (
                    <Badge
                      cursor="pointer"
                      as="button"
                      colorPalette="red"
                      onClick={() => {}}
                    >
                      <LuPencil /> delayed {remark.delay} min.{" "}
                    </Badge>
                  ) : (
                    <Badge colorPalette="green">
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
          ))}
        </Flex>
      ) : (
        <Text>No remarks available</Text>
      )}
    </>
  );
}
