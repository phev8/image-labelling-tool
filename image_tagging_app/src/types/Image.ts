import { MarkingInstance } from "./MarkingInstance/MarkingInstance";


export class Image {
  public readonly id: string;

  public markings: MarkingInstance[] = [];

  constructor(id: string) {
    this.id = id;
  }
}