import { MarkingOption } from "./MarkingOption";

export class GridMarkingOption extends MarkingOption {
  public classes: { classID: string, classTitle: string }[] = [];
  public readonly gridX: number = 1;
  public readonly gridY: number = 1;

  constructor(id: string, title: string, gridX: number, gridY: number) {
    super(id, title);
    if (gridX > 0 && gridY > 0 && Number.isSafeInteger(gridX) && Number.isSafeInteger(gridY)) {
      this.gridX = gridX;
      this.gridY = gridY;
    } else { 
      console.log("GridMarkingOption grid dimensions must be integer, safe and >= 1");    
    }
  }
}