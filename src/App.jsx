// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { useEffect } from "react";

export default function App() {
  // useEffect(() => {
  //   // Disable right-click
  //   const handleContextMenu = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   // Block F12, Ctrl+Shift+I, etc.
  //   const handleKeyDown = (e) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
  //       (e.ctrlKey && e.key === "U") // Block "View Source"
  //     ) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);

  //   // Cleanup when component unmounts
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  return (
    <MantineProvider>
      <RouterProvider router={routes} />
    </MantineProvider>
  );
}
