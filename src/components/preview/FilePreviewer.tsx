"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { FileIcon, Maximize2Icon, EyeIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type CustomFilePreviewerProps = {
  fileUrl: string;
  fileName: string;
  fileType: string;
};

export default function CustomFilePreviewer({
  fileUrl,
  fileName,
  fileType,
}: CustomFilePreviewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (fileType.startsWith("text/")) {
      setIsLoading(true);
      fetch(fileUrl)
        .then((response) => response.text())
        .then((text) => {
          setContent(text);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching text content:", error);
          setIsLoading(false);
        });
    }
  }, [fileUrl, fileType]);

  const renderPreview = (fullSize: boolean = false) => {
    const containerClass = fullSize
      ? "w-full h-full"
      : "w-full h-48 md:h-64 lg:h-80";

    if (isLoading) {
      return (
        <div className={`${containerClass} flex items-center justify-center`}>
          <Progress value={progress} className="w-1/2" />
        </div>
      );
    }

    if (fileType.startsWith("image/")) {
      return (
        <div className={`${containerClass} relative group`}>
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <iframe src={fileUrl} className={`${containerClass} border-none`} />
      );
    } else if (fileType.startsWith("text/") && content) {
      return (
        <pre
          className={`${containerClass} bg-gray-100 p-4 rounded overflow-auto text-sm`}
        >
          {content}
        </pre>
      );
    } else {
      return (
        <div
          className={`${containerClass} flex flex-col items-center justify-center bg-gray-100 rounded`}
        >
          <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
          <span className="text-gray-600 text-sm text-center">{fileName}</span>
        </div>
      );
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <EyeIcon className="h-4 w-4 mr-2" />
          View
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full h-full flex">
        <DrawerHeader className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-6 w-6 text-gray-400" />
            <DrawerTitle className="text-lg font-semibold truncate">
              {fileName}
            </DrawerTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              <Maximize2Icon className="h-4 w-4 " />
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-28 h-[calc(100vh-120px)]">{renderPreview(true)}</div>
      </DrawerContent>
    </Drawer>
  );
}
