export interface Product {
  id: string;
  name: string;
  value: number;
  //productImage : string;
}

export const mockProducts: Product[] = [
  { id: "P001", name: "Product A", value: 100 },
  { id: "P002", name: "Product B", value: 250 },
  { id: "P003", name: "Product C", value: 75 },
  // Add more mock products as needed
];

export const getProductById = (
  id: string
): Product | undefined => {
  return mockProducts.find(
    (product) => product.id === id
  );
};
