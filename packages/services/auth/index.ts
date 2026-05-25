import { hash, compare } from "bcryptjs";
import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { refreshTokens, users, type User } from "@repo/database/schema";
import { ACCESS_TOKEN_LIFETIME_MS, REFRESH_TOKEN_LIFETIME_MS } from "./constants";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "./jwt";
import { toPublicUser } from "./utils";
import type {
  AuthPayload,
  ChangePasswordInput,
  ChangeUserDetailsInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  UserPublic,
} from "./types";

class UserService {
  public async register({
    email,
    firstName,
    lastName,
    password,
  }: RegisterInput): Promise<UserPublic> {
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

  public async login({ email, password }: LoginInput): Promise<AuthPayload> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const publicUser = toPublicUser(user);
    const accessToken = createAccessToken(publicUser);
    const refreshToken = createRefreshToken(user.id);
    const accessTokenExpiresAt = new Date(Date.now() + ACCESS_TOKEN_LIFETIME_MS);
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    });

    return {
      user: publicUser,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
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

  public async refresh({ refreshToken }: RefreshTokenInput): Promise<AuthPayload> {
    verifyRefreshToken(refreshToken);
    const user = await this.getUserByRefreshToken(refreshToken);

    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));

    const publicUser = toPublicUser(user);
    const accessToken = createAccessToken(publicUser);
    const newRefreshToken = createRefreshToken(user.id);
    const accessTokenExpiresAt = new Date(Date.now() + ACCESS_TOKEN_LIFETIME_MS);
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

    await db.insert(refreshTokens).values({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    });

    return {
      user: publicUser,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    };
  }

  public async logout({ refreshToken }: RefreshTokenInput): Promise<boolean> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return true;
  }

  public async changePassword({
    refreshToken,
    currentPassword,
    newPassword,
  }: ChangePasswordInput): Promise<boolean> {
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
  }: ChangeUserDetailsInput): Promise<UserPublic> {
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
export { verifyAccessToken } from "./jwt";
