import { useRef, useState } from "react";
// import { App, env } from "@application-tracker/frontend";

const Popup: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  function screenshot() {
    captureFullPageScreenshot((dataUrl) => {
      setImg(dataUrl);
    });
  }

  async function captureFullPageScreenshot(
    callback: (dataUrl: string) => void
  ) {
    const dataUrls: string[] = [];

    const activeTab = await new Promise<chrome.tabs.Tab | undefined>(
      (resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          resolve(tabs[0]);
        });
      }
    );

    if (!activeTab?.id) {
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => window.scrollTo(0, 0),
    });

    async function captureScreenshot() {
      const screenshot = await new Promise<string>((resolve) => {
        chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
          resolve(dataUrl);
        });
      });

      dataUrls.push(screenshot);

      if (!activeTab?.id) {
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => window.scrollBy(0, window.innerHeight),
      });

      const reachedBottom = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () =>
          window.scrollY >= document.body.scrollHeight - window.innerHeight,
      });

      if (reachedBottom[0].result) {
        await stitchScreenshots(dataUrls, callback);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        captureScreenshot();
      }
    }

    captureScreenshot();
  }

  async function stitchScreenshots(
    dataUrls: string[],
    callback: (dataUrl: string) => void
  ) {
    const images = await Promise.all(
      dataUrls.map(
        (dataUrl) =>
          new Promise<HTMLImageElement>((resolve) => {
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
              resolve(img);
            };
          })
      )
    );
    const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

    if (!canvas.current) {
      return;
    }

    canvas.current.width = images[0].width;
    canvas.current.height = totalHeight;

    const ctx = canvas.current.getContext("2d");

    let currentHeight = 0;
    for (const img of images) {
      ctx?.drawImage(img, 0, currentHeight);
      currentHeight += img.height;
    }

    callback(
      canvas.current.toDataURL("image/png", {
        width: canvas.current.width,
        height: canvas.current.height,
        left: 0,
        top: 0,
        format: "png",
      })
    );
  }

  // <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
  //   <header className="flex flex-col items-center justify-center text-white">
  //     Test
  //   </header>
  //   <button onClick={screenshot}>Click me</button>
  //   {img && <img src={img} />}
  //   {!img && <canvas id="canvas" ref={canvas} />}
  // </div>

  const login = () => {
    (async () => {
      const response = await chrome.runtime.sendMessage("login");
      // do something with response here, not outside the function
      console.log(response);
    })();
  };

  return (
    <>
      {/* <App /> */}
      <button onClick={login}>Log in</button>
    </>
  );
};

export default Popup;
