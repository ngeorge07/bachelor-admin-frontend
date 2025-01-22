import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { AuthContextProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <AuthContextProvider>
          <Provider>{children}</Provider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
