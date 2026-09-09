import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), email: text('email').notNull(), name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
});
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull(), dob: text('dob').notNull().default(''),
  education: text('education').notNull().default(''), phone: text('phone').notNull().default(''),
  skills: text('skills').notNull().default('[]'), complete: integer('complete').notNull().default(0),
  phoneVerified: integer('phone_verified').notNull().default(0), updatedAt: integer('updated_at').notNull(),
});
export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(), profileId: text('profile_id').notNull().references(() => profiles.id),
  expiresAt: integer('expires_at').notNull(),
});
export const challenges = sqliteTable('auth_challenges', {
  tokenHash: text('token_hash').primaryKey(), expiresAt: integer('expires_at').notNull(),
});
export const otpLimits = sqliteTable('otp_limits', {
  id: text('id').primaryKey(), count: integer('count').notNull(), resetsAt: integer('resets_at').notNull(),
  lastAt: integer('last_at').notNull(),
});
export const phoneChallenges = sqliteTable('phone_challenges', {
  profileId: text('profile_id').primaryKey(), phone: text('phone').notNull(),
  sid: text('sid').notNull(), expiresAt: integer('expires_at').notNull(), attempts: integer('attempts').notNull().default(0),
});
