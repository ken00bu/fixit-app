export type FormValues = {
  file: File | null | string;
} & Record<string, any>;