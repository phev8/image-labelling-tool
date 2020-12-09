import { MarkingInstance } from "./MarkingInstance";

export class GridMarkingInstance extends MarkingInstance {

  public activeCells: { x: number, y: number }[] = [];

  constructor(classID: string) {
    super(classID);
  }
}