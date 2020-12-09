export abstract class MarkingInstance {
  public readonly classID: string

  constructor(classID: string) {
    this.classID = classID;
  }
}
