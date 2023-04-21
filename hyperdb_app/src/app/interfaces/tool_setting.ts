export interface NewToolSetting {
    cbaero_settings_fk: number | null;
    cart3d_settings_fk: number | null;
}

export interface ToolSetting {
    id: number;
    hash: string;
    cbaero_settings_fk: number;
    cart3d_settings_fk: number;

}