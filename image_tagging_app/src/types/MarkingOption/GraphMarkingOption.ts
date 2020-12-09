import { MarkingInstance } from "../MarkingInstance/MarkingInstance";
import { MarkingOption } from "./MarkingOption";

export enum GraphMarkingType {
  PointCloud,
  Graph,
  SimpleAreaPolygon // In geometry, a simple polygon is a polygon that does not intersect itself and has no holes. 
}

export class GraphMarkingOption extends MarkingOption {

  public readonly type: GraphMarkingType;

  public minNodes: number=0;
  public maxNodes: number = Number.MAX_SAFE_INTEGER;
  public preset?: MarkingInstance;

  //only relevant for GraphMarkingType.SimplePolygon
  public equalLengthSides?: boolean = false;

  constructor(id: string, title: string, type: GraphMarkingType) {
    super(id, title);
    this.type = type;
  }
}


/*
  Examples:
    A bounding box: type=SimpleAreaPolygon, minNodes=maxNodes=4, equalLengthSides=true
    A simple area polygon: type=SimpleAreaPolygon, minNodes=3
    A single point: type=PointCloud, minNodes=maxNodes=1
    A skeleton: type=Graph, minNodes=maxNodes=this.blueprint.nodes.length
*/