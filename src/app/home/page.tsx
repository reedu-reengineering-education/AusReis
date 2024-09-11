// "use client";
// import React from "react";
// import { LoginRegisterForm } from "@/components/forms/LoginRegisterForm";
// import { MainNav } from "@/app/main-nav"; // Importiere die MainNav-Komponente

// export default function HomePage({ params }: { params: { userId: string } }) {
//   const handleUserCreated = () => {
//     console.log("User created");
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <MainNav /> {/* Füge die MainNav-Komponente hier ein */}
//       <main className="flex-1">
//         <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
//           <div className="space-y-4 text-center">
//             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
//               Revolutionize Your Web Presence
//             </h1>
//             <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
//               Unlock the full potential of your online business with our
//               cutting-edge platform. Streamline your workflow, boost
//               performance, and deliver exceptional user experiences.
//             </p>
//             <div className="flex flex-col gap-2 sm:flex-row">
//               <LoginRegisterForm
//                 user={params.userId}
//                 handleUserCreated={handleUserCreated}
//               />
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
//         <div className="container">
//           &copy; 2024 Reedu GmbH & Co. KG. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }
// dieser code ist in src/app/page.tsx
// wofür brauche ich dann den home ordner?
// was ist der unterschied zwischen home und page?
