"use client";

import { useEffect, useState } from "react";
import { Heading, Text, Spinner, Box, Flex, Button } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { Remark } from "@/interfaces/Remark";
import { useRouter } from "next/navigation";
import RemarkCard from "@/components/RemarkCard";

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
      <Flex mb={5} alignItems="center" gap={10}>
        <Heading>Train Remarks</Heading>
        <Button as="a" onClick={() => router.push("/remarks/add-remark")}>
          Add Remark
        </Button>
      </Flex>

      {remarks.length > 0 ? (
        <Flex direction="column" gap="4">
          {remarks.map((remark, index) => (
            <RemarkCard key={index} remark={remark} loadRemarks={loadRemarks} />
          ))}
        </Flex>
      ) : (
        <Text>No remarks available</Text>
      )}
    </>
  );
}
