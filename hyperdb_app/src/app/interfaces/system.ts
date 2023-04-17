export interface System {
    id: number;
    name: string;
    classification: string;
    country_fk: number | null;
}

export interface NewSystem {
    name: string;
    classification: string;
    country_fk: number | null;
}