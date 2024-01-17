import Layout from "@/components/Layout/Layout";
import Providers from "./providers";
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head />
      <body>
        <Providers>
          <Layout>{children} </Layout>
        </Providers>
      </body>
    </html>
  );
}
