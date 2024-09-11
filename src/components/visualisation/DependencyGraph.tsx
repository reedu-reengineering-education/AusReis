// "use client";
// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import data from "../../../d3Data.json"; // Falls d3data.json im selben Verzeichnis ist

// const DependencyGraph: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     const width = 960;
//     const height = 600;

//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .style("border", "1px solid black");

//     // Setup force simulation
//     const simulation = d3
//       .forceSimulation(data.nodes)
//       .force(
//         "link",
//         d3
//           .forceLink(data.links)
//           .id((d) => d.id)
//           .distance(200)
//       )
//       .force("charge", d3.forceManyBody().strength(-300))
//       .force("center", d3.forceCenter(width / 2, height / 2));

//     // Draw links
//     const link = svg
//       .append("g")
//       .selectAll("line")
//       .data(data.links)
//       .join("line")
//       .attr("stroke", "#999")
//       .attr("stroke-opacity", 0.6)
//       .attr("stroke-width", 2);

//     // Draw nodes
//     const node = svg
//       .append("g")
//       .selectAll("circle")
//       .data(data.nodes)
//       .join("circle")
//       .attr("r", 10)
//       .attr("fill", "#69b3a2")
//       .call(drag(simulation));

//     // Add labels
//     const label = svg
//       .append("g")
//       .selectAll("text")
//       .data(data.nodes)
//       .join("text")
//       .attr("dy", -3)
//       .attr("x", 12)
//       .text((d) => d.id);

//     // Simulation update function
//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d) => (d.source as any).x)
//         .attr("y1", (d) => (d.source as any).y)
//         .attr("x2", (d) => (d.target as any).x)
//         .attr("y2", (d) => (d.target as any).y);

//       node.attr("cx", (d) => d.x as number).attr("cy", (d) => d.y as number);

//       label.attr("x", (d) => d.x as number).attr("y", (d) => d.y as number);
//     });

//     // Drag behavior
//     function drag(simulation) {
//       function dragstarted(event, d) {
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         d.fy = d.y;
//       }

//       function dragged(event, d) {
//         d.fx = event.x;
//         d.fy = event.y;
//       }

//       function dragended(event, d) {
//         if (!event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         d.fy = null;
//       }

//       return d3
//         .drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended);
//     }
//   }, []);

//   return <svg ref={svgRef}></svg>;
// };

// export default DependencyGraph;

//------------------------------------------------------------------------------------------------------------------------------------------------
"use client";

import data from "../../../d3data.json"; // Hier liegt deine d3data.json
import flare from "../../../flare.json"; // Hier liegt deine flare.json

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HierarchicalEdgeBundling: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 960;
    const radius = width / 2;
    const innerRadius = radius - 120;

    const cluster = d3.cluster().size([360, innerRadius]);

    const line: d3.RadialLine<[number, number]> = d3
      .radialLine<[number, number]>()
      .curve(d3.curveBundle.beta(0.85))
      .radius((d: any) => d.y)
      .angle((d: any) => (d.x / 180) * Math.PI);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", width)
      .append("g")
      .attr("transform", `translate(${radius},${radius})`);

    let link: d3.Selection<SVGPathElement, unknown, SVGGElement, unknown> = svg
      .append("g")
      .selectAll(".link");
    let node: d3.Selection<SVGTextElement, any, SVGGElement, unknown> = svg
      .append("g")
      .selectAll(".node");

    // Lade die JSON-Daten
    import("../../../flare.json").then((data) => {
      const root = packageHierarchy(data).sum((d: any) => d.size);

      cluster(root);

      link = link
        .data(packageImports(root.leaves()))
        .enter()
        .append("path")
        .each((d: any) => {
          d.source = d[0];
          d.target = d[d.length - 1];
        })
        .attr("class", "link")
        .attr("d", (d: any) => line(d));

      node = node
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class", "node")
        .attr("dy", "0.31em")
        .attr(
          "transform",
          (d: any) =>
            `rotate(${d.x - 90})translate(${d.y + 8},0)${
              d.x < 180 ? "" : "rotate(180)"
            }`
        )
        .attr("text-anchor", (d: any) => (d.x < 180 ? "start" : "end"))
        .text((d: any) => d.data.key);
    });

    function packageHierarchy(classes: any) {
      const map: any = {};

      function find(name: string, data?: any) {
        let node = map[name],
          i;
        if (!node) {
          node = map[name] = data || { name: name, children: [] };
          if (name.length) {
            node.parent = find(name.substring(0, (i = name.lastIndexOf("."))));
            node.parent.children.push(node);
            node.key = name.substring(i + 1);
          }
        }
        return node;
      }

      classes.forEach(function (d: any) {
        find(d.name, d);
      });

      return d3.hierarchy(map[""]);
    }

    function packageImports(nodes: any) {
      const map: any = {};
      const imports: any = [];

      nodes.forEach(function (d: any) {
        map[d.data.name] = d;
      });

      nodes.forEach(function (d: any) {
        if (d.data.imports)
          d.data.imports.forEach(function (i: any) {
            imports.push(map[d.data.name].path(map[i]));
          });
      });

      return imports;
    }
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default HierarchicalEdgeBundling;
