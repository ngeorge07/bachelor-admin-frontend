"use client";

import Header from "@/components/Header";
import { Center, Spinner, Container } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when authState has been fetched
    if (!authState.isAuthenticated) {
      router.push("/signin"); // Redirect to home if authenticated
    } else {
      setLoading(false); // Stop loading once we know the authentication state
    }
  }, [authState.isAuthenticated, router]);

  if (loading) {
    // Show a spinner or loading screen while the auth state is being determined
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Container mt={10} px={16}>
        {children}
      </Container>
    </>
  );
}
