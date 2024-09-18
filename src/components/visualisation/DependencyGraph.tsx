"use client";
import React, { useRef, useEffect } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";

interface NodeData {
  name: string;
  size?: number;
  children?: NodeData[];
}

interface DependencyGraphProps {
  data: NodeData;
  width: number;
  height: number;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({
  data,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      10,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    const createNode = (
      name: string,
      size: number,
      position: Vector3,
      color: Color3
    ) => {
      const sphere = MeshBuilder.CreateSphere(name, { diameter: size }, scene);
      sphere.position = position;

      const material = new StandardMaterial("material", scene);
      material.diffuseColor = color;
      sphere.material = material;
    };

    const createLink = (start: Vector3, end: Vector3, color: Color3) => {
      const points = [start, end];
      const lines = MeshBuilder.CreateLines("lines", { points }, scene);
      lines.color = color;
    };

    const createGraph = (
      node: NodeData,
      position: Vector3,
      level: number = 0
    ) => {
      const size = node.size || 1;
      const nodeColor = new Color3(Math.random(), Math.random(), Math.random()); // Zufällige Farbe für Knoten
      createNode(node.name, size, position, nodeColor);

      if (node.children) {
        const angleStep = (2 * Math.PI) / node.children.length;
        node.children.forEach((child, index) => {
          const angle = index * angleStep;
          const distance = 3 + level * 2;
          const childPosition = new Vector3(
            position.x + distance * Math.cos(angle),
            position.y,
            position.z + distance * Math.sin(angle)
          );
          const linkColor = new Color3(0, 0, 1); // Farbe für Verbindungen (Blau)
          createLink(position, childPosition, linkColor);
          createGraph(child, childPosition, level + 1);
        });
      }
    };

    createGraph(data, new Vector3(0, 0, 0));

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default DependencyGraph;
