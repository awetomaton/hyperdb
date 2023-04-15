export interface Comment {
    id: number;
    title: string;
    body: string;
    contributor_fk: number;
    system_fk: number;
    geometry_fk: number;
    mesh_fk: number;
    tool_mesh_association_fk: number;
    configured_tool_fk: number;
}