declare module "fabric/fabric-impl" {
  // Common
  class Gif {}
  class Arrow {}
  // Element
  class Iframe {}
  class Chart {}
  class Element {}
  class Video {}
  // Node
  class Node {}
  // Link
  class Link {}
  class CurvedLink {}
  class OrthogonalLink {}
  class Cube {}
  // SVG
  class Svg {}

  interface ICreateProperties {
    type: "string";
    initialize(options: any): void;
    toObject?(propertiesToInclude: string[]): void;
    _render?(ctx: CanvasRenderingContext2D): void;
  }

  interface IUtilClass {
    /**
     * Helper for creation of "classes".
     * @param [parent] optional "Class" to inherit from
     * @param [properties] Properties shared by all instances of this class
     *                  (be careful modifying objects defined here as this would affect all instances)
     */
    createClass(parent: any, properties?: ICreateProperties);
  }

  type IUtil = fabric.IUtil & IUtilClass;

  export const util: IUtil;
}
