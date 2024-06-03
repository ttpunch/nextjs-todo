import { ITodo} from "@/model/todo";

export interface ApiResponse {
  success: boolean;
  message: string;
  messages?: Array<ITodo>
};