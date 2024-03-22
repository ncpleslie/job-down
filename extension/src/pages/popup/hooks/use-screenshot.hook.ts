import { useRef, useState } from "react";

const useScreenshot = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [capturing, setCapturing] = useState(false);

  async function captureFullPageScreenshot(
    callback: (dataUrl: string) => void
  ) {
    if (capturing) {
      return;
    }

    setCapturing(true);
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
    setCapturing(false);
  }

  async function stitchScreenshots(
    dataUrls: string[],
    callback: (dataUrl: string) => void
  ) {
    const images = await Promise.all(
      dataUrls.map(
        (dataUrl) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
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

  return { captureFullPageScreenshot, canvasRef: canvas };
};

export default useScreenshot;
