import "./globals.css";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";

export const metadata = {
  title: "The Cyprus Advantage · Document Management Prototype",
  description: "Cyprus residency document portal — Next.js prototype",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css"
        />
      </head>
      <body>
        {children}
        <Modal />
        <Toast />
      </body>
    </html>
  );
}
