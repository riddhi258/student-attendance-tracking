import { ThemeProvider } from "./ThemeProvider";

import "./globals.css";

export const metadata = {
  title: "Trackify",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
