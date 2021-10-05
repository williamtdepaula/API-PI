interface Person {
    CPF: string;
    nome: string;
    endereco: string;
    idade: number;
    telefone: string;
    nascimento: string;
    email?: string;
    genero: string;
    horario_contato?: string;
    observacoes?: string;
    UBS: string;
    grupo_risco: string;
}

export { Person }