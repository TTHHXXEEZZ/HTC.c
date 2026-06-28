import "./globals.css";
import Header from "../components/Header";
import SessionProvider from "../components/SessionProvider";

export const metadata = {
  title: "Hatyai Technical College Insight",
  description: "ฐานข้อมูลแนะแนวและการฝึกงาน วิทยาลัยเทคนิคหาดใหญ่ (HTC)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        {/* Leaflet CSS map assets loaded globally */}
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body>
        <SessionProvider>
          <div className="app-container">
            <Header />
            <div className="app-main-wrapper">
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
