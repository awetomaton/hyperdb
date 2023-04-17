export interface Comment {
    id: number;
    title: string;
    body: string;
    contributor_fk: number | null;
    system_fk: number | null;
    geometry_fk: number | null;
    mesh_fk: number | null;
    tool_mesh_association_fk: number | null;
    configured_tool_fk: number | null;
}

export interface NewComment {
    title: string;
    body: string;
    contributor_fk: number | null;
    system_fk: number | null;
    geometry_fk: number | null;
    mesh_fk: number | null;
    tool_mesh_association_fk: number | null;
    configured_tool_fk: number | null;
}