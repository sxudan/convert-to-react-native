import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import Code from "./src/Code";

function App() {
  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Define the message handler
    const handleMessage = (event: MessageEvent) => {
      console.log(event);
      if (event.data.pluginMessage.type === "generate-code") {
        setIsLoading(false);
        setCode(event.data.pluginMessage.data);
      } else if (event.data.pluginMessage.type === "loading-code") {
        setIsLoading(true);
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <div>{isLoading ? <p>Loading...</p> : <Code code={code} />}</div>;
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
