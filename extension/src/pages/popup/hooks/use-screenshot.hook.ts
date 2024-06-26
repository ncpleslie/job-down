import { useRef, useState } from "react";

const useScreenshot = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [isError, setIsError] = useState(false);

  const captureFullPageScreenshot = async (
    callback: (dataUrl: string) => void
  ) => {
    if (capturing) {
      return;
    }

    setIsError(false);
    setCapturing(true);
    const dataUrls: string[] = [];

    try {
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

      // Delete "fixed" CSS properties to avoid overlapping elements
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: async () => {
          const elements = document.querySelectorAll("*");

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const style = window.getComputedStyle(element);

            if (style["position"] === "fixed") {
              (element as HTMLElement).setAttribute(
                "style",
                "position:static !important"
              );
              (element as HTMLElement).setAttribute(
                "job-down-static",
                "active"
              );
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        },
      });

      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: async () => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 200));
        },
      });

      const captureScreenshot = async () => {
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
          await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: async () => {
              const staticElements = document.querySelectorAll(
                '[job-down-static="active"]'
              );
              staticElements.forEach((element) => {
                element.removeAttribute("style");
                element.removeAttribute("job-down-static");
              });
            },
          });

          await stitchScreenshots(dataUrls, callback);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await captureScreenshot();
        }
      };

      await captureScreenshot();
      setCapturing(false);
    } catch (error) {
      setIsError(true);
      setCapturing(false);
    }
  };

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

  return { captureFullPageScreenshot, canvasRef: canvas, capturing, isError };
};

export default useScreenshot;
