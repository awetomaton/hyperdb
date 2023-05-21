export interface AeroRun {
    id: number;
    name: string;
    status: string;
    datetime_created: string;
    datetime_completed: string;
    contributor_fk: string;
    configured_tool_fk: string;
    mesh_fk: string;
}
