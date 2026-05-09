export type Faculty = {
    id: number;
    name: string;
    code: string;
    isSystem?: boolean;
    createdAt?: string;
    building?: Building[];
}

export type Building = {
  id: number;
  name: string;
  floors: number;
  faculty: Faculty | null;
  isSystem: boolean;
  isGeneral: boolean;
  created_at: string;
};


export type Faculties = Faculty[];
export type Buildings = Building[];