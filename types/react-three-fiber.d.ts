declare global {
  namespace JSX {
    interface IntrinsicElements {
      line: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        geometry?: THREE.BufferGeometry;
        material?: THREE.Material;
      };
      lineBasicMaterial: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        attach: string;
        color?: string;
      };
      bufferGeometry: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        attach: string;
      };
    }
  }
}
