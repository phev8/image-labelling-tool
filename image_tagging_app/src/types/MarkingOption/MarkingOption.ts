export abstract class MarkingOption { 
  public readonly id: string;
  public title: string = "";

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
   }
}