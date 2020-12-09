import { GraphMarkingType } from "../MarkingOption/GraphMarkingOption";
import { MarkingInstance } from "./MarkingInstance";

export class GraphMarkingInstance extends MarkingInstance {

  public readonly graphMarkingType: GraphMarkingType;
  public nodes: Map<number, {x:number, y:number}> = new Map();
  public edges?: [ keyFrom: number, keyTo: number][];

  constructor(classID: string, graphMarkingType: GraphMarkingType) {
    super(classID);
    this.graphMarkingType = graphMarkingType;
  }
}