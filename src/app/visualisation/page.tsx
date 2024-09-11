// import React from "react";
// import Graph3D from "@/components/visualisation/DependencyGraph";
// const VisualisationPage = () => {
//   return (
//     <div>
//       <h1>3D Dependency Graph</h1>
//       <Graph3D />
//     </div>
//   );
// };

// export default VisualisationPage;
// ----------------------------------------------------------------------------
import React from "react";
import HierarchicalEdgeBundling from "@/components/visualisation/DependencyGraph";

const VisualizationPage = () => {
  return (
    <div>
      <h1>Hierarchical Edge Bundling</h1>
      <HierarchicalEdgeBundling />
    </div>
  );
};

export default VisualizationPage;
