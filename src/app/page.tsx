import { HStack, Button } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function Home() {
  return (
    <HStack>
      <ColorModeButton />
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
  );
}
