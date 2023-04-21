export interface Mesh {
    id: number;
    file: string;
    contributor_fk: number;
    geometry_fk: number;
}


export interface NewMesh {
    file: string;
    contributor_fk: number;
    geometry_fk: number;
}