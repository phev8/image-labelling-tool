import { MarkingOption } from "./MarkingOption";

export class SimpleMarkingOption extends MarkingOption {
  public classes: { classID: string, classTitle: string }[] = [];
  public singleChoice: boolean = false;

  constructor(id:string, title:string) {
    super(id, title);
  }
}