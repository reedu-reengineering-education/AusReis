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
// -----------------------------------------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import {
//   FileIcon,
//   Maximize2Icon,
//   EyeIcon,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// type FileInfo = {
//   fileUrl: string;
//   fileName: string;
//   fileType: string;
// };

// type CustomFilePreviewerProps = {
//   files?: FileInfo[] | FileInfo;
// };

// export default function CustomFilePreviewer({
//   files,
// }: CustomFilePreviewerProps) {
//   const fileArray = Array.isArray(files) ? files : files ? [files] : [];

//   const [contents, setContents] = useState<(string | null)[]>(
//     new Array(fileArray.length).fill(null)
//   );
//   const [isLoading, setIsLoading] = useState<boolean[]>(
//     new Array(fileArray.length).fill(false)
//   );
//   const [progress, setProgress] = useState<number[]>(
//     new Array(fileArray.length).fill(0)
//   );

//   useEffect(() => {
//     fileArray.forEach((file, index) => {
//       if (file.fileType.startsWith("text/")) {
//         setIsLoading((prev) => {
//           const newLoading = [...prev];
//           newLoading[index] = true;
//           return newLoading;
//         });
//         fetch(file.fileUrl)
//           .then((response) => response.text())
//           .then((text) => {
//             setContents((prev) => {
//               const newContents = [...prev];
//               newContents[index] = text;
//               return newContents;
//             });
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           })
//           .catch((error) => {
//             console.error(
//               `Error fetching text content for file ${file.fileName}:`,
//               error
//             );
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           });
//       }
//     });
//   }, [fileArray]);

//   const renderPreview = (
//     file: FileInfo,
//     content: string | null,
//     loading: boolean,
//     fileProgress: number,
//     index: number,
//     fullSize: boolean = false
//   ) => {
//     const containerClass = fullSize
//       ? "w-full h-full"
//       : "w-full h-48 md:h-64 lg:h-80";

//     if (loading) {
//       return (
//         <div className={`${containerClass} flex items-center justify-center`}>
//           <Progress value={fileProgress} className="w-1/2" />
//         </div>
//       );
//     }

//     if (file.fileType.startsWith("image/")) {
//       return (
//         <div className={`${containerClass} relative group`}>
//           <img
//             src={file.fileUrl}
//             alt={file.fileName}
//             className="w-full h-full object-contain transition-transform group-hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
//         </div>
//       );
//     } else if (file.fileType === "application/pdf") {
//       return (
//         <iframe
//           src={file.fileUrl}
//           className={`${containerClass} border-none`}
//         />
//       );
//     } else if (file.fileType.startsWith("text/") && content) {
//       return (
//         <pre
//           className={`${containerClass} bg-gray-100 p-4 rounded overflow-auto text-sm`}
//         >
//           {content}
//         </pre>
//       );
//     } else {
//       return (
//         <div
//           className={`${containerClass} flex flex-col items-center justify-center bg-gray-100 rounded`}
//         >
//           <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
//           <span className="text-gray-600 text-sm text-center">
//             {file.fileName}
//           </span>
//         </div>
//       );
//     }
//   };

//   if (fileArray.length === 0) {
//     return null;
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="sm">
//           <EyeIcon className="h-4 w-4 mr-2" />
//           View {fileArray.length > 1 ? "Files" : "File"}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="w-full h-full flex flex-col">
//         <DrawerHeader className="flex justify-between items-center border-b pb-4">
//           <div className="flex items-center space-x-2">
//             <FileIcon className="h-6 w-6 text-gray-400" />
//             <DrawerTitle className="text-lg font-semibold truncate">
//               File Preview
//             </DrawerTitle>
//           </div>
//           <DrawerClose asChild>
//             <Button variant="outline" size="sm">
//               <X className="h-4 w-4" />
//             </Button>
//           </DrawerClose>
//         </DrawerHeader>
//         <div className="flex-grow overflow-hidden">
//           <Carousel
//             opts={{ align: "start" }}
//             className="w-full max-w-6xl mx-auto"
//           >
//             <CarouselContent className="h-full">
//               {fileArray.map((file, index) => (
//                 <CarouselItem key={index} className="h-full">
//                   <div className="h-full flex flex-col">
//                     <div className="flex justify-between items-center p-4">
//                       <span className="font-semibold">{file.fileName}</span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => window.open(file.fileUrl, "_blank")}
//                       >
//                         <Maximize2Icon className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="flex-grow px-4 pb-4">
//                       {renderPreview(
//                         file,
//                         contents[index],
//                         isLoading[index],
//                         progress[index],
//                         index,
//                         true
//                       )}
//                     </div>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             {fileArray.length > 1 && (
//               <>
//                 <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2">
//                   <ChevronLeft className="h-6 w-6" />
//                 </CarouselPrevious>
//                 <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <ChevronRight className="h-6 w-6" />
//                 </CarouselNext>
//               </>
//             )}
//           </Carousel>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
// -----------------------------------------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import {
//   FileIcon,
//   Maximize2Icon,
//   EyeIcon,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// type FileInfo = {
//   id: number;
//   fileName: string;
//   fileType: string;
// };

// type CustomFilePreviewerProps = {
//   files: FileInfo[];
// };

// export default function CustomFilePreviewer({
//   files,
// }: CustomFilePreviewerProps) {
//   const [contents, setContents] = useState<(string | null)[]>(
//     new Array(files.length).fill(null)
//   );
//   const [isLoading, setIsLoading] = useState<boolean[]>(
//     new Array(files.length).fill(false)
//   );
//   const [progress, setProgress] = useState<number[]>(
//     new Array(files.length).fill(0)
//   );

//   useEffect(() => {
//     files.forEach((file, index) => {
//       if (file.fileType.startsWith("text/")) {
//         setIsLoading((prev) => {
//           const newLoading = [...prev];
//           newLoading[index] = true;
//           return newLoading;
//         });
//         fetch(`/api/download/${file.id}`)
//           .then((response) => response.text())
//           .then((text) => {
//             setContents((prev) => {
//               const newContents = [...prev];
//               newContents[index] = text;
//               return newContents;
//             });
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           })
//           .catch((error) => {
//             console.error(
//               `Error fetching text content for file ${file.fileName}:`,
//               error
//             );
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           });
//       }
//     });
//   }, [files]);

//   const renderPreview = (
//     file: FileInfo,
//     content: string | null,
//     loading: boolean,
//     fileProgress: number,
//     index: number,
//     fullSize: boolean = false
//   ) => {
//     const containerClass = fullSize
//       ? "w-full h-full"
//       : "w-full h-48 md:h-64 lg:h-80";

//     if (loading) {
//       return (
//         <div className={`${containerClass} flex items-center justify-center`}>
//           <Progress value={fileProgress} className="w-1/2" />
//         </div>
//       );
//     }

//     if (file.fileType.startsWith("image/")) {
//       return (
//         <div className={`${containerClass} relative group`}>
//           <img
//             src={`/api/download/${file.id}`}
//             alt={file.fileName}
//             className="w-full h-full object-contain transition-transform group-hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
//         </div>
//       );
//     } else if (file.fileType === "application/pdf") {
//       return (
//         <iframe
//           src={`/api/download/${file.id}`}
//           className={`${containerClass} border-none`}
//         />
//       );
//     } else if (file.fileType.startsWith("text/") && content) {
//       return (
//         <pre
//           className={`${containerClass} bg-gray-100 p-4 rounded overflow-auto text-sm`}
//         >
//           {content}
//         </pre>
//       );
//     } else {
//       return (
//         <div
//           className={`${containerClass} flex flex-col items-center justify-center bg-gray-100 rounded`}
//         >
//           <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
//           <span className="text-gray-600 text-sm text-center">
//             {file.fileName}
//           </span>
//         </div>
//       );
//     }
//   };

//   if (files.length === 0) {
//     return null;
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="sm">
//           <EyeIcon className="h-4 w-4 mr-2" />
//           View {files.length > 1 ? "Files" : "File"}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="w-full h-full flex flex-col">
//         <DrawerHeader className="flex justify-between items-center border-b pb-4">
//           <div className="flex items-center space-x-2">
//             <FileIcon className="h-6 w-6 text-gray-400" />
//             <DrawerTitle className="text-lg font-semibold truncate">
//               File Preview
//             </DrawerTitle>
//           </div>
//           <DrawerClose asChild>
//             <Button variant="outline" size="sm">
//               <X className="h-4 w-4" />
//             </Button>
//           </DrawerClose>
//         </DrawerHeader>
//         <div className="flex-grow overflow-hidden relative">
//           <Carousel
//             opts={{ align: "start" }}
//             className="w-full max-w-6xl mx-auto h-full"
//           >
//             <CarouselContent className="h-full">
//               {files.map((file, index) => (
//                 <CarouselItem key={index} className="h-full">
//                   <div className="h-full flex flex-col">
//                     <div className="flex justify-between items-center p-4">
//                       <span className="font-semibold">{file.fileName}</span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           window.open(`/api/download/${file.id}`, "_blank")
//                         }
//                       >
//                         <Maximize2Icon className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="flex-grow px-4 pb-4">
//                       {renderPreview(
//                         file,
//                         contents[index],
//                         isLoading[index],
//                         progress[index],
//                         index,
//                         true
//                       )}
//                     </div>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             {files.length > 1 && (
//               <>
//                 <CarouselPrevious
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
//                   size="lg"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </CarouselPrevious>
//                 <CarouselNext
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
//                   size="lg"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </CarouselNext>
//               </>
//             )}
//           </Carousel>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
// -----------------------------------------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import {
//   FileIcon,
//   Maximize2Icon,
//   EyeIcon,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// type FileInfo = {
//   id: number;
//   fileName: string;
//   fileType: string;
// };

// type CustomFilePreviewerProps = {
//   files?: FileInfo[] | FileInfo;
// };

// export default function CustomFilePreviewer({
//   files,
// }: CustomFilePreviewerProps) {
//   const fileArray = Array.isArray(files) ? files : files ? [files] : [];

//   const [contents, setContents] = useState<(string | null)[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean[]>([]);
//   const [progress, setProgress] = useState<number[]>([]);

//   useEffect(() => {
//     setContents(new Array(fileArray.length).fill(null));
//     setIsLoading(new Array(fileArray.length).fill(false));
//     setProgress(new Array(fileArray.length).fill(0));
//   }, [fileArray]);

//   useEffect(() => {
//     fileArray.forEach((file, index) => {
//       if (file.fileType.startsWith("text/")) {
//         setIsLoading((prev) => {
//           const newLoading = [...prev];
//           newLoading[index] = true;
//           return newLoading;
//         });
//         fetch(`/api/download/${file.id}`)
//           .then((response) => response.text())
//           .then((text) => {
//             setContents((prev) => {
//               const newContents = [...prev];
//               newContents[index] = text;
//               return newContents;
//             });
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           })
//           .catch((error) => {
//             console.error(
//               `Error fetching text content for file ${file.fileName}:`,
//               error
//             );
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           });
//       }
//     });
//   }, [fileArray]);

//   const renderPreview = (
//     file: FileInfo,
//     content: string | null,
//     loading: boolean,
//     fileProgress: number,
//     index: number,
//     fullSize: boolean = false
//   ) => {
//     const containerClass = fullSize
//       ? "w-full h-full"
//       : "w-full h-48 md:h-64 lg:h-80";

//     if (loading) {
//       return (
//         <div className={`${containerClass} flex items-center justify-center`}>
//           <Progress value={fileProgress} className="w-1/2" />
//         </div>
//       );
//     }

//     if (file.fileType.startsWith("image/")) {
//       return (
//         <div className={`${containerClass} relative group`}>
//           <img
//             src={`/api/download/${file.id}`}
//             alt={file.fileName}
//             className="w-full h-full object-contain transition-transform group-hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
//         </div>
//       );
//     } else if (file.fileType === "application/pdf") {
//       return (
//         <iframe
//           src={`/api/download/${file.id}`}
//           className={`${containerClass} border-none`}
//         />
//       );
//     } else if (file.fileType.startsWith("text/") && content) {
//       return (
//         <pre
//           className={`${containerClass} bg-gray-100 p-4 rounded overflow-auto text-sm`}
//         >
//           {content}
//         </pre>
//       );
//     } else {
//       return (
//         <div
//           className={`${containerClass} flex flex-col items-center justify-center bg-gray-100 rounded`}
//         >
//           <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
//           <span className="text-gray-600 text-sm text-center">
//             {file.fileName}
//           </span>
//         </div>
//       );
//     }
//   };

//   if (fileArray.length === 0) {
//     return null;
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="sm">
//           <EyeIcon className="h-4 w-4 mr-2" />
//           View {fileArray.length > 1 ? "Files" : "File"}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="w-full h-full flex flex-col">
//         <DrawerHeader className="flex justify-between items-center border-b pb-4">
//           <div className="flex items-center space-x-2">
//             <FileIcon className="h-6 w-6 text-gray-400" />
//             <DrawerTitle className="text-lg font-semibold truncate">
//               File Preview
//             </DrawerTitle>
//           </div>
//           <DrawerClose asChild>
//             <Button variant="outline" size="sm">
//               <X className="h-4 w-4" />
//             </Button>
//           </DrawerClose>
//         </DrawerHeader>
//         <div className="flex-grow overflow-hidden relative">
//           <Carousel
//             opts={{ align: "start" }}
//             className="w-full max-w-6xl mx-auto h-full"
//           >
//             <CarouselContent className="h-full">
//               {fileArray.map((file, index) => (
//                 <CarouselItem key={index} className="h-full">
//                   <div className="h-full flex flex-col">
//                     <div className="flex justify-between items-center p-4">
//                       <span className="font-semibold">{file.fileName}</span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           window.open(`/api/download/${file.id}`, "_blank")
//                         }
//                       >
//                         <Maximize2Icon className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="flex-grow px-4 pb-4">
//                       {renderPreview(
//                         file,
//                         contents[index],
//                         isLoading[index],
//                         progress[index],
//                         index,
//                         true
//                       )}
//                     </div>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             {fileArray.length > 1 && (
//               <>
//                 <CarouselPrevious
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
//                   size="lg"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </CarouselPrevious>
//                 <CarouselNext
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
//                   size="lg"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </CarouselNext>
//               </>
//             )}
//           </Carousel>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
// -----------------------------------------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import {
//   FileIcon,
//   Maximize2Icon,
//   EyeIcon,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// type FileInfo = {
//   id: number;
//   fileName: string;
//   fileType: string;
// };

// type CustomFilePreviewerProps = {
//   files?: FileInfo[];
// };

// export default function CustomFilePreviewer({
//   files = [],
// }: CustomFilePreviewerProps) {
//   const [contents, setContents] = useState<(string | null)[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean[]>([]);
//   const [progress, setProgress] = useState<number[]>([]);

//   useEffect(() => {
//     setContents(new Array(files.length).fill(null));
//     setIsLoading(new Array(files.length).fill(false));
//     setProgress(new Array(files.length).fill(0));

//     files.forEach((file, index) => {
//       if (file.fileType.startsWith("text/")) {
//         setIsLoading((prev) => {
//           const newLoading = [...prev];
//           newLoading[index] = true;
//           return newLoading;
//         });
//         fetch(`/api/download/${file.id}`)
//           .then((response) => response.text())
//           .then((text) => {
//             setContents((prev) => {
//               const newContents = [...prev];
//               newContents[index] = text;
//               return newContents;
//             });
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           })
//           .catch((error) => {
//             console.error(
//               `Error fetching text content for file ${file.fileName}:`,
//               error
//             );
//             setIsLoading((prev) => {
//               const newLoading = [...prev];
//               newLoading[index] = false;
//               return newLoading;
//             });
//           });
//       }
//     });
//   }, [files]);

//   const renderPreview = (
//     file: FileInfo,
//     content: string | null,
//     loading: boolean,
//     fileProgress: number,
//     index: number,
//     fullSize: boolean = false
//   ) => {
//     const containerClass = fullSize
//       ? "w-full h-full"
//       : "w-full h-96 max-h-[70vh]";

//     if (loading) {
//       return (
//         <div className={`${containerClass} flex items-center justify-center`}>
//           <Progress value={fileProgress} className="w-1/2" />
//         </div>
//       );
//     }

//     if (file.fileType.startsWith("image/")) {
//       return (
//         <div className={`${containerClass} relative group`}>
//           <img
//             src={`/api/download/${file.id}`}
//             alt={file.fileName}
//             className="w-full h-full object-contain transition-transform group-hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
//         </div>
//       );
//     } else if (file.fileType === "application/pdf") {
//       return (
//         <iframe
//           src={`/api/download/${file.id}`}
//           className={`${containerClass} border-none`}
//         />
//       );
//     } else if (file.fileType.startsWith("text/") && content) {
//       return (
//         <pre
//           className={`${containerClass} bg-gray-100 p-4 rounded overflow-auto text-sm`}
//         >
//           {content}
//         </pre>
//       );
//     } else {
//       return (
//         <div
//           className={`${containerClass} flex flex-col items-center justify-center bg-gray-100 rounded`}
//         >
//           <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
//           <span className="text-gray-600 text-sm text-center">
//             {file.fileName}
//           </span>
//         </div>
//       );
//     }
//   };

//   if (files.length === 0) {
//     return null;
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="sm">
//           <EyeIcon className="h-4 w-4 mr-2" />
//           View {files.length > 1 ? "Files" : "File"}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="w-full h-full flex ">
//         <DrawerHeader className="flex justify-between items-center border-b pb-4">
//           <div className="flex items-center space-x-2">
//             <FileIcon className="h-6 w-6 text-gray-400" />
//             <DrawerTitle className="text-lg font-semibold truncate">
//               File Preview
//             </DrawerTitle>
//           </div>
//           <DrawerClose asChild>
//             <Button variant="outline" size="sm">
//               <X className="h-4 w-4" />
//             </Button>
//           </DrawerClose>
//         </DrawerHeader>
//         <div className="flex-grow overflow-hidden relative">
//           {/* <Carousel className="w-full h-full"> */}
//           <Carousel
//             opts={{ align: "start" }}
//             className="w-full max-w-7xl mx-auto h-full"
//           >
//             <CarouselContent className="h-full">
//               {files.map((file, index) => (
//                 <CarouselItem key={index} className="h-full">
//                   <div className="h-full flex flex-col">
//                     <div className="flex justify-between items-center p-4">
//                       <span className="font-semibold">{file.fileName}</span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           window.open(`/api/download/${file.id}`, "_blank")
//                         }
//                       >
//                         <Maximize2Icon className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="flex-grow px-4 pb-4 overflow-auto">
//                       {renderPreview(
//                         file,
//                         contents[index],
//                         isLoading[index],
//                         progress[index],
//                         index,
//                         false
//                       )}
//                     </div>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious
//               className="absolute -left-44 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 z-10 h-24 w-24 rounded-full"
//               size="lg"
//             />
//             <CarouselNext
//               className="absolute -right-44 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 z-10 h-24 w-24 rounded-full"
//               size="lg"
//             />
//           </Carousel>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
