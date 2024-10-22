import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MinioFileViewerProps = {
  fileKey: string;
  bucketName: string;
};

export default function MinioFileViewer({
  fileKey,
  bucketName,
}: MinioFileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(
          `/api/minio-file?key=${fileKey}&bucket=${bucketName}`
        );
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Datei");
        }
        const data = await response.json();
        setFileUrl(data.url);
        setFileType(data.contentType);
      } catch (err) {
        setError("Fehler beim Laden der Datei");
        console.error(err);
      }
    };

    fetchFile();
  }, [fileKey, bucketName]);

  const renderFileContent = () => {
    if (!fileUrl || !fileType) return null;

    if (fileType.startsWith("image/")) {
      return (
        <Image
          src={fileUrl}
          alt="Minio File"
          width={500}
          height={300}
          layout="responsive"
          objectFit="contain"
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <iframe src={fileUrl} width="100%" height="500px" title="PDF Viewer" />
      );
    } else {
      return (
        <Button onClick={() => window.open(fileUrl, "_blank")}>
          Datei herunterladen
        </Button>
      );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Minio Datei Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : fileUrl ? (
          renderFileContent()
        ) : (
          <p>Lade Datei...</p>
        )}
      </CardContent>
    </Card>
  );
}
// ----------------------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// type CustomFilePreviewerProps = {
//   fileUrl: string;
//   fileName: string;
//   fileType: string;
// };

// export default function CustomFilePreviewer({
//   fileUrl,
//   fileName,
//   fileType,
// }: CustomFilePreviewerProps) {
//   const [fileContent, setFileContent] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         const response = await fetch(fileUrl);
//         if (!response.ok) throw new Error("Fehler beim Laden der Datei");
//         const blob = await response.blob();

//         if (fileType.startsWith("image/")) {
//           setFileContent(URL.createObjectURL(blob));
//         } else if (fileType === "application/pdf") {
//           // Für PDFs wird wir einen iframe verwenden
//           setFileContent(URL.createObjectURL(blob));
//         } else if (fileType.startsWith("text/")) {
//           const text = await blob.text();
//           setFileContent(text);
//         }
//       } catch (error) {
//         console.error("Fehler beim Laden der Datei:", error);
//       }
//     };

//     fetchFile();
//   }, [fileUrl, fileType]);

//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardContent className="p-6">
//         <h2 className="text-2xl font-bold mb-4">{fileName}</h2>
//         {fileType.startsWith("image/") && fileContent && (
//           <img src={fileContent} alt={fileName} className="max-w-full h-auto" />
//         )}
//         {fileType === "application/pdf" && fileContent && (
//           <div className="h-[600px]">
//             <iframe src={fileContent} className="w-full h-full" />
//           </div>
//         )}
//         {fileType.startsWith("text/") && fileContent && (
//           <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
//             {fileContent}
//           </pre>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
