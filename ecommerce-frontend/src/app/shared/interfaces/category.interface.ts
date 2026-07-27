export interface Category {
  _id?: string;
  name: string;
  image: string;
  subtitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryApiResponse {
  status: string;
  data: {
    data: Category[];
  };
}
