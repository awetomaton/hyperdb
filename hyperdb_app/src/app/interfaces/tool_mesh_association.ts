export interface ToolMeshAssociation {
    id: number;
    contributor_fk: number;
    mesh_fk: number;
    configured_tool_fk: number;
}

export interface NewToolMeshAssociation {
    contributor_fk: number;
    mesh_fk: number;
    configured_tool_fk: number;
}