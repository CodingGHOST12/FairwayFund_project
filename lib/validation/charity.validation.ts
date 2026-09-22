import { z } from 'zod';
import { charityConfig } from '@/lib/charity/charity-config';

export const charitySelectionSchema = z.object({
  charityId: z.string().min(1, 'Please select a charity'),
  contributionPercentage: z.coerce
    .number()
    .int('Contribution percentage must be a whole number')
    .min(
      charityConfig.minimumContributionPercentage,
      `Minimum charity contribution is ${charityConfig.minimumContributionPercentage}%`
    )
    .max(
      charityConfig.maximumContributionPercentage,
      `Maximum charity contribution is ${charityConfig.maximumContributionPercentage}%`
    ),
});

export type CharitySelectionFormData = z.infer<typeof charitySelectionSchema>;

export const donationSchema = z.object({
  charityId: z.string().min(1, 'Please select a charity'),
  amount: z.coerce.number().positive('Donation amount must be greater than 0'),
  donorName: z.string().min(2, 'Name must be at least 2 characters'),
  donorEmail: z.string().email('Please enter a valid email address'),
  message: z.string().max(300, 'Message cannot exceed 300 characters').optional(),
});

export type DonationFormData = z.infer<typeof donationSchema>;

export const charitySchema = z.object({
  name: z.string().min(2, 'Charity name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().min(50, 'Long description must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  location: z.string().min(2, 'Location is required').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type CharityFormData = z.infer<typeof charitySchema>;
