import { align } from "@/utils/util-use";
import { label } from "./label";

export const title = (text: string) => `${align(label(text), "end", 7)} `;
