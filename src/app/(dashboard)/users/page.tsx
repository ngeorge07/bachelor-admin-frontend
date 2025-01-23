"use client";

import { useEffect, useState } from "react";
import { Heading, Text, Spinner, Box, Flex, Button } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { UserInterface } from "@/interfaces/User";
import UserCard from "@/components/UserCard";

async function fetchUsers() {
  const token = getCookie("token");

  try {
    const response = await fetch("http://localhost:3000/api/users/", {
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

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      setError("Failed to load remarks");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
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
        <Button as="a" onClick={() => router.push("/users/add-user")}>
          Add User
        </Button>
      </Flex>

      {users.length > 0 ? (
        <Flex flexDirection="row" flexWrap="wrap" gap={5}>
          {users.map((user) => (
            <UserCard key={user._id} user={user} loadUsers={loadUsers} />
          ))}
        </Flex>
      ) : (
        <Text>No remarks available</Text>
      )}
    </>
  );
}
