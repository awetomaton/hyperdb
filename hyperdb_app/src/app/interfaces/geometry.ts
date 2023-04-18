export interface Geometry {
    id: number;
    file: string;
    contributor_fk: number;
    system_fk: number;
    classification: string;
}

export interface NewGeometry {
    file: string;
    contributor_fk: number;
    system_fk: number;
    classification: string;
}