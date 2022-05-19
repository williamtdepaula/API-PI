interface GroupRisk {
    idGrupoRisco: number;
    descricao: string;
}

interface UBS {
    idUBS: number;
    CNES: number;
    nome: string;
    isADM: string;
    address?: string;
}

export { GroupRisk, UBS }