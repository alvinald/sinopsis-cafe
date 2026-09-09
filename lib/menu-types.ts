export type MenuCategory =
  | "Coffee"
  | "Non-Coffee"
  | "Pastry"
  | "Dessert"
  | "Food"
  | "Beverage"

export interface MenuItem {
  id: number
  name: string
  category:
    | "Coffee"
    | "Non-Coffee"
    | "Pastry"
    | "Dessert"
    | "Food"
    | "Beverage"
  description: string
  price: number
  image: string
  available: boolean
  tags: string[]
}
