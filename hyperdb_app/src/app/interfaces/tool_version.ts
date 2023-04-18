import { ConfiguredTool, AssociatedConfiguredTool } from "./configured_tool";


export interface ToolVersion {
    id: number;
    version: string;
    configurations: AssociatedConfiguredTool[];
}