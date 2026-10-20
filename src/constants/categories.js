import {
  Smartphone,
  CreditCard,
  Wallet,
  Key,
  BookOpen,
  Shirt,
  Coffee,
  Package,
} from 'lucide-react'

export const CATEGORIES = [
  {
    id: 'Electronics',
    name: 'Electronics',
    icon: Smartphone,
    color: '#3b82f6',
    placeholder: 'electronics.svg',
  },
  {
    id: 'ID & Cards',
    name: 'ID & Cards',
    icon: CreditCard,
    color: '#8b5cf6',
    placeholder: 'id-cards.svg',
  },
  {
    id: 'Wallets & Bags',
    name: 'Wallets & Bags',
    icon: Wallet,
    color: '#ec4899',
    placeholder: 'wallets-bags.svg',
  },
  {
    id: 'Keys',
    name: 'Keys',
    icon: Key,
    color: '#eab308',
    placeholder: 'keys.svg',
  },
  {
    id: 'Books & Stationery',
    name: 'Books & Stationery',
    icon: BookOpen,
    color: '#10b981',
    placeholder: 'books.svg',
  },
  {
    id: 'Clothing & Accessories',
    name: 'Clothing & Accessories',
    icon: Shirt,
    color: '#06b6d4',
    placeholder: 'clothing.svg',
  },
  {
    id: 'Bottles & Lunch Boxes',
    name: 'Bottles & Lunch Boxes',
    icon: Coffee,
    color: '#f97316',
    placeholder: 'bottle.svg',
  },
  {
    id: 'Other',
    name: 'Other',
    icon: Package,
    color: '#6b7280',
    placeholder: 'generic.svg',
  },
]

export const getCategory = (name) => {
  return CATEGORIES.find((cat) => cat.name === name) || CATEGORIES[CATEGORIES.length - 1]
}
