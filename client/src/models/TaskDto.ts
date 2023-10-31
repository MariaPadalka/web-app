export default interface TaskDto {
    _id: string;
    title: string;
    index: number;
    status: string;
    percentage: number;
    result?: number;
  }