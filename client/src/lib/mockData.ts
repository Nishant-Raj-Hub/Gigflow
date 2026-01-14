// Mock data for development/testing
// This can be removed when backend is fully integrated

import { IGig, IBid, IUser } from './types';

// Mock users
export const mockUsers: Record<string, IUser> = {
  user1: {
    _id: 'user1',
    username: 'raj_sharma',
    name: 'Raj Sharma',
    email: 'raj.sharma@example.com',
    createdAt: new Date('2025-01-01'),
  },
  user2: {
    _id: 'user2',
    username: 'priya_patel',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    createdAt: new Date('2025-02-01'),
  },
  user3: {
    _id: 'user3',
    username: 'amit_kumar',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    createdAt: new Date('2025-03-01'),
  },
  user4: {
    _id: 'user4',
    username: 'sneha_gupta',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    createdAt: new Date('2025-04-01'),
  },
};

export const mockGigs: IGig[] = [
  {
    _id: '1',
    id: '1',
    title: 'Build E-commerce Platform',
    description: 'Need a modern e-commerce platform with support for Indian payment methods like UPI, Google Pay, and Paytm. Should handle multiple languages and currencies. Platform needs to be responsive and support 100K+ products. Must integrate with Indian logistics partners for shipping.',
    budget: 150000,
    owner: mockUsers.user1,
    ownerId: 'user1',
    status: 'open',
    createdAt: new Date('2026-01-10'),
  },
  {
    _id: '2',
    id: '2',
    title: 'Fix Mobile App Performance',
    description: 'Our React Native mobile app is experiencing crashes on Android devices with low storage. Need to optimize bundle size, improve memory usage, and fix navigation lag. App is used by 50K+ users across India. Priority: reduce app size by 40% and fix crashes.',
    budget: 75000,
    owner: mockUsers.user2,
    ownerId: 'user2',
    status: 'open',
    createdAt: new Date('2026-01-12'),
  },
  {
    _id: '3',
    id: '3',
    title: 'Setup CI/CD Infrastructure',
    description: 'Setup AWS infrastructure for a SaaS platform targeting Indian startups. Need to configure EC2, RDS, S3, CloudFront. Setup automated deployment pipeline with GitHub Actions. Configure monitoring with CloudWatch. Must ensure GDPR and data residency compliance for India.',
    budget: 200000,
    owner: mockUsers.user3,
    ownerId: 'user3',
    status: 'assigned',
    createdAt: new Date('2026-01-08'),
  },
  {
    _id: '4',
    id: '4',
    title: 'Design Landing Page',
    description: 'Design a modern, professional landing page and marketing website for a B2B SaaS startup. Need responsive design for mobile and desktop. Should include pricing pages, testimonials section, blog integration, and CTA optimization. Deliverables: Figma designs, interactive prototypes, and handoff documentation.',
    budget: 120000,
    owner: mockUsers.user4,
    ownerId: 'user4',
    status: 'open',
    createdAt: new Date('2026-01-11'),
  },
];

export const mockBids: IBid[] = [
  {
    _id: 'bid1',
    id: 'bid1',
    gig: '1',
    gigId: '1',
    freelancer: 'freelancer1',
    freelancerId: 'freelancer1',
    message: 'I have 7 years of full-stack development experience with expertise in building e-commerce platforms. Have successfully integrated UPI, Google Pay, and Paytm in 5+ projects. Can deliver this in 3-4 weeks with comprehensive testing.',
    price: 140000,
    status: 'pending',
    createdAt: new Date('2026-01-11'),
  },
  {
    _id: 'bid2',
    id: 'bid2',
    gig: '1',
    gigId: '1',
    freelancer: 'freelancer2',
    freelancerId: 'freelancer2',
    message: 'Expert in React, Node.js, and AWS. Have built 8+ e-commerce platforms. Familiar with all Indian payment gateways and logistics integrations. Can start immediately and deliver within 25 days.',
    price: 145000,
    status: 'pending',
    createdAt: new Date('2026-01-12'),
  },
  {
    _id: 'bid3',
    id: 'bid3',
    gig: '3',
    gigId: '3',
    freelancer: 'freelancer3',
    freelancerId: 'freelancer3',
    message: 'AWS Solutions Architect with 10+ years experience. Have setup infrastructure for 20+ Indian startups. Expert in security, compliance, and cost optimization. Can have infrastructure ready in 2 weeks with 24/7 support included.',
    price: 190000,
    status: 'hired',
    createdAt: new Date('2026-01-10'),
  },
];
