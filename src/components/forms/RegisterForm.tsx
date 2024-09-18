"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HierarchicalEdgeBundle = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const radius = width / 2;

    const cluster = d3.cluster().size([360, radius - 120]);

    const line = d3
      .radialLine()
      .curve(d3.curveBundle.beta(0.85))
      .radius((d) => d.y)
      .angle((d) => (d.x / 180) * Math.PI);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", width)
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const root = d3.hierarchy(data).sum((d) => d.size);

    cluster(root);

    svg
      .selectAll(".link")
      .data(root.leaves())
      .enter()
      .append("path")
      .each((d) => (d.target = d))
      .attr("class", "link")
      .attr("d", (d) => line(d.target.path(d.target.source)));

    svg
      .selectAll(".node")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", (d) => `rotate(${d.x - 90}) translate(${d.y},0)`)
      .text((d) => d.data.name);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default HierarchicalEdgeBundle;
