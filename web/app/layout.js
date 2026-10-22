export const metadata = { title: "Sample App" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: "4rem auto", maxWidth: "40rem" }}>
        {children}
      </body>
    </html>
  );
}
