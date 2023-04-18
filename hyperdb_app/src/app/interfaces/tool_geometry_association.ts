export interface ToolGeometryAssociation {
    id: number;
    contributor_fk: number;
    geometry_fk: number;
    configured_tool_fk: number;
}

export interface NewToolGeometryAssociation {
    contributor_fk: number;
    geometry_fk: number;
    configured_tool_fk: number;
}