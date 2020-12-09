import { Image } from "./Image";
import { MarkingOption } from "./MarkingOption/MarkingOption";
import { Task } from "./Task";

export class ImageSet {
  public readonly id: string;
  public title: string;

  public images: Image[] = [];
  public tasks: Task[] = [];
  public markingOptions: MarkingOption[] = [];

  constructor(id: string, title: string) { 
    this.id = id;
    this.title = title;
  }
}