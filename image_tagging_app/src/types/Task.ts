import { Image } from "./Image";
import { MarkingOption } from "./MarkingOption/MarkingOption";

export class Task {
  public readonly id: string;
  public title: string;

  //Using Set may save a lot of code, as it filters duplicates automatically. May be used like an array otherwise.
  public markingOptionsSelectionIDs: Set<string> = new Set();
  public finishedImageIDs: Set<string> = new Set();
  public imageSelector: any;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}