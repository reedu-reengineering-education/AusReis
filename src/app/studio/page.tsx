// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import axios from "axios";

// const Annotator = dynamic(() => import("react-image-annotate"), { ssr: false });

// export default function Annotate() {
//   const [files, setFiles] = useState([]);
//   const [analysisResults, setAnalysisResults] = useState({});

//   useEffect(() => {
//     async function fetchFiles() {
//       const response = await axios.get("/api/files");
//       setFiles(response.data.files);
//     }

//     fetchFiles();
//   }, []);
//   const analyzeFile = async (file) => {
//     const response = await axios.get(`/api/analyze?fileName=${file.name}`);
//     setAnalysisResults((prev) => ({
//       ...prev,
//       [file.name]: response.data.text,
//     }));
//   };

//   return (
//     <div>
//       {files.length > 0 &&
//         files.map((file) => (
//           <div key={file.name}>
//             <img
//               src={`/uploads/${file.name}`}
//               alt={file.name}
//               width={200}
//               onClick={() => analyzeFile(file)}
//             />
//             <pre>{analysisResults[file.name]}</pre>
//           </div>
//         ))}
//     </div>
//     // <div>
//     //   {files.length > 0 && (
//     //     <Annotator
//     //       images={files.map((file) => ({
//     //         src: `/uploads/${file.name}`,
//     //         name: file.name,
//     //       }))}
//     //       regionClsList={["Rechnungsnummer", "Gesamtbetrag", "Datum", "Name"]}
//     //     />
//     //   )}
//     // </div>
//   );
// }
