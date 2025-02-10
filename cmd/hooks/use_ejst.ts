import { Github } from "@/github/readfile";


export const useGetEjst = async (value: string): Promise<string> => {
    const data = await Github();
    if (data.BOILERPLATE_YAML) {
        for (const project of data.BOILERPLATE_YAML) {
            if (project.value === value && project.ejst) {
                return project.ejst;
            }
            if (project.children) {
                for (const child of project.children) {
                    if (child.value === value) {
                        return child.ejst || "";
                    }
                }
            }
        }
    }
    return "";
};
