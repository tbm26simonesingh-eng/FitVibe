import { ActivityType, Reward } from './types';
import { 
  Footprints, 
  Bike, 
  Dumbbell, 
  BrainCircuit, 
  Waves, 
  Flame 
} from 'lucide-react';

export const POINTS_CONFIG: Record<ActivityType, { rate: number; unit: 'steps' | 'mins'; label: string; icon: any; color: string }> = {
  STEPS: { 
    rate: 0.01, // 1000 steps = 10 points
    unit: 'steps', 
    label: 'Walking',
    icon: Footprints,
    color: 'bg-emerald-100 text-emerald-600'
  },
  RUNNING: { 
    rate: 1, // 1 min = 1 point
    unit: 'mins', 
    label: 'Running',
    icon: Flame,
    color: 'bg-orange-100 text-orange-600'
  },
  CYCLING: { 
    rate: 0.8, // 1 min = 0.8 points
    unit: 'mins', 
    label: 'Cycling',
    icon: Bike,
    color: 'bg-blue-100 text-blue-600'
  },
  GYM: { 
    rate: 1.2, // 1 min = 1.2 points
    unit: 'mins', 
    label: 'Workout / Gym',
    icon: Dumbbell,
    color: 'bg-purple-100 text-purple-600'
  },
  MEDITATION: { 
    rate: 0.5, // 1 min = 0.5 points
    unit: 'mins', 
    label: 'Meditation',
    icon: BrainCircuit,
    color: 'bg-indigo-100 text-indigo-600'
  },
  SWIMMING: { 
    rate: 1.5, // 1 min = 1.5 points
    unit: 'mins', 
    label: 'Swimming',
    icon: Waves,
    color: 'bg-cyan-100 text-cyan-600'
  },
};

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Amazon Gift Card',
    vendor: 'Amazon',
    points_required: 500,
    value_display: '$5.00',
    image_url: 'https://picsum.photos/seed/amazon/400/250'
  },
  {
    id: 'r2',
    name: 'Swiggy Food Voucher',
    vendor: 'Swiggy',
    points_required: 300,
    value_display: '₹200',
    image_url: 'https://picsum.photos/seed/food/400/250'
  },
  {
    id: 'r3',
    name: 'Uber Ride Pass',
    vendor: 'Uber',
    points_required: 450,
    value_display: '$5.00',
    image_url: 'https://picsum.photos/seed/car/400/250'
  },
  {
    id: 'r4',
    name: 'Nike Store Credit',
    vendor: 'Nike',
    points_required: 2000,
    value_display: '$25.00',
    image_url: 'https://picsum.photos/seed/shoe/400/250'
  },
  {
    id: 'r5',
    name: 'Flipkart Voucher',
    vendor: 'Flipkart',
    points_required: 1000,
    value_display: '₹500',
    image_url: 'https://picsum.photos/seed/shop/400/250'
  },
  {
    id: 'r6',
    name: 'Zomato Gold',
    vendor: 'Zomato',
    points_required: 800,
    value_display: '3 Months',
    image_url: 'https://picsum.photos/seed/eat/400/250'
  },
];