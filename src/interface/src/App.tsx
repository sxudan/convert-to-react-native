import * as React from "react";
import Code from "./features/code";
import TabBar from "./features/tabbar";

function App() {
  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Define the message handler
    const handleMessage = (event: MessageEvent) => {
      if (event && event.data && event.data.pluginMessage) {
        if ("type" in event.data.pluginMessage) {
          if (event.data.pluginMessage.type === "generate-code") {
            setIsLoading(false);
            setCode(event.data.pluginMessage.data);
          } else if (event.data.pluginMessage.type === "loading-code") {
            setIsLoading(true);
          }
        }
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      <TabBar />
      {isLoading ? (
        <p className="underline">Loading...</p>
      ) : (
        <Code code={code} />
      )}
    </div>
  );
}

export default App;
