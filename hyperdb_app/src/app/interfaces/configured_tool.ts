export interface AssociatedConfiguredTool {
    associated: boolean;
    configuredTool: ConfiguredTool;
}


export interface ConfiguredTool {
    id: number;
    name: string;
    tool_fk: number;
    tool_settings_fk: number;
}