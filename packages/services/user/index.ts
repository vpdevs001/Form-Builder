import { randomUUID } from "crypto";
import { hash, compare } from "bcryptjs";
import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { refreshTokens, users, type User } from "@repo/database/schema";

const REFRESH_TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type UserPublic = Omit<User, "passwordHash" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

function toPublicUser(user: User): UserPublic {
  const { passwordHash, createdAt, updatedAt, ...publicUser } = user;
  return {
    ...publicUser,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

function generateRefreshToken() {
  return randomUUID();
}

class UserService {
  public async register({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string;
    firstName: string;
    lastName?: string;
    password: string;
  }): Promise<UserPublic> {
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw new Error("Email is already registered");
    }

    const passwordHash = await hash(password, 10);
    const [createdUser] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
        passwordHash,
      })
      .returning();

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return toPublicUser(createdUser);
  }

  public async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: UserPublic; refreshToken: string; refreshTokenExpiresAt: string }> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      user: toPublicUser(user),
      refreshToken,
      refreshTokenExpiresAt: expiresAt.toISOString(),
    };
  }

  private async getUserByRefreshToken(refreshToken: string): Promise<User> {
    const [tokenRow] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken));

    if (!tokenRow || tokenRow.expiresAt <= new Date()) {
      throw new Error("Refresh token is invalid or expired");
    }

    const [user] = await db.select().from(users).where(eq(users.id, tokenRow.userId));

    if (!user) {
      throw new Error("Refresh token is invalid or expired");
    }

    return user;
  }

  public async refresh({
    refreshToken,
  }: {
    refreshToken: string;
  }): Promise<{ user: UserPublic; refreshToken: string; refreshTokenExpiresAt: string }> {
    const user = await this.getUserByRefreshToken(refreshToken);

    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));

    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    await db.insert(refreshTokens).values({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      user: toPublicUser(user),
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: expiresAt.toISOString(),
    };
  }

  public async logout({ refreshToken }: { refreshToken: string }): Promise<boolean> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return true;
  }

  public async changePassword({
    refreshToken,
    currentPassword,
    newPassword,
  }: {
    refreshToken: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> {
    const user = await this.getUserByRefreshToken(refreshToken);

    const isPasswordValid = await compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const newPasswordHash = await hash(newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
    return true;
  }

  public async changeUserDetails({
    refreshToken,
    firstName,
    lastName,
    email,
  }: {
    refreshToken: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<UserPublic> {
    const user = await this.getUserByRefreshToken(refreshToken);

    if (email && email !== user.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, email));

      if (existingUser.length > 0) {
        throw new Error("Email is already in use");
      }
    }

    const updateValues: Partial<User> = {};
    if (firstName !== undefined) updateValues.firstName = firstName;
    if (lastName !== undefined) updateValues.lastName = lastName ?? null;
    if (email !== undefined) updateValues.email = email;
    updateValues.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser) {
      throw new Error("Unable to update user details");
    }

    return toPublicUser(updatedUser);
  }
}

export default UserService;
