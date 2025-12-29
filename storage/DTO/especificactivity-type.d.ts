type EspecificActivityTypeDTO = {
    id: string;
    name: string;
    value: number;
    type: 'receitas' | 'despesas';
    dataActivity?: Date;
    createAt?: Date;
}
