import { Flex, Heading, Link } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { AuthContext } from "@/app/context/AuthContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { authState } = useContext(AuthContext);
  const isSuperAdmin = authState.userData?.roles.includes("superAdmin");

  const pathname = usePathname();

  return (
    <Flex as="header" px={"16"} py={6} justify="space-between" align="center">
      <Heading as="h1" fontSize="3xl">
        My train dashboard
      </Heading>

      <Flex gap="4.5">
        <Flex as="nav" gap="7">
          <Link
            textDecoration={
              pathname.includes("/dashboard/remarks") ? "underline" : "none"
            }
            color={
              pathname.includes("/dashboard/remarks") ? "white" : "gray.300"
            }
            href="/dashboard/remarks"
          >
            Remarks
          </Link>
          <Link href="/delays">Delays</Link>
          <Link href="/profile">Profile</Link>

          {isSuperAdmin && <Link href="#">Users</Link>}
        </Flex>

        <ColorModeButton />
      </Flex>
    </Flex>
  );
}
