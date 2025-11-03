import studentRoom1 from "@/assets/student-room-1.jpg";
import studentRoom2 from "@/assets/student-room-2.jpg";
import studentRoom3 from "@/assets/student-room-3.jpg";

export type MockProperty = {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  type: string;
  roommates: number;
  amenities: string[];
  premium?: boolean;
  address?: string;
};

export const mockProperties: MockProperty[] = [
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "Quarto Moderno - Vila Universitária",
    location: "2,5km da USP - São Paulo",
    price: 1200,
    rating: 4.8,
    reviews: 24,
    image: studentRoom1,
    type: "Quarto Individual",
    roommates: 3,
    amenities: ["wifi", "parking", "kitchen"],
    premium: true,
  },
  {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    title: "República Aconchegante",
    location: "1,8km da UNICAMP - Campinas",
    price: 850,
    rating: 4.6,
    reviews: 18,
    image: studentRoom2,
    type: "República",
    roommates: 5,
    amenities: ["wifi", "pets", "kitchen"],
  },
  {
    id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    title: "Apartamento Compartilhado",
    location: "3km da UFRJ - Rio de Janeiro",
    price: 1450,
    rating: 4.9,
    reviews: 31,
    image: studentRoom3,
    type: "Quarto Compartilhado",
    roommates: 2,
    amenities: ["wifi", "parking", "kitchen", "pets"],
    premium: true,
  },
  {
    id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
    title: "Casa Estudantil Completa",
    location: "1,2km da UFMG - Belo Horizonte",
    price: 980,
    rating: 4.7,
    reviews: 15,
    image: studentRoom1,
    type: "Casa Estudantil",
    roommates: 6,
    amenities: ["wifi", "pets", "kitchen"],
  },
  {
    id: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    title: "Studio Individual Premium",
    location: "800m da PUC - Porto Alegre",
    price: 1680,
    rating: 4.9,
    reviews: 42,
    image: studentRoom2,
    type: "Studio",
    roommates: 0,
    amenities: ["wifi", "parking", "kitchen"],
    premium: true,
  },
  {
    id: "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66",
    title: "Quarto em República Feminina",
    location: "1,5km da UFSC - Florianópolis",
    price: 750,
    rating: 4.5,
    reviews: 12,
    image: studentRoom3,
    type: "República",
    roommates: 4,
    amenities: ["wifi", "kitchen"],
  },
];
