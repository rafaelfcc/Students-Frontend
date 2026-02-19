export type StudentListItemDto = {
  id: number;
  nome: string;
};

type StudentBase = {
  nome: string;
  idade: number;
  serie: number;
  notaMedia: number;
  endereco: string;
  nomePai: string;
  nomeMae: string;
  dataNascimento: string;
};

export type StudentCreateRequest = StudentBase;

export type StudentUpdateRequest = StudentBase & { id: number; };

export type StudentDetailDto = StudentBase & { id: number; };