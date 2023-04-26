import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';

export class jwtService {
  createJWT(userId: ObjectId) {
    const token = jwt.sign({ userId: userId }, settings.JWT_SECRET, {
      expiresIn: '10h',
    });
    return token;
  }

  async createJWTRefresh(userId: ObjectId, deviceId: ObjectId) {
    const newRefreshedToken = jwt.sign(
      { userId, deviceId },
      settings.JWT_SECRET,
      { expiresIn: '20h' },
    );
    return newRefreshedToken;
  }

  getUserIdFromRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  getDeviceIdFromRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.deviceId;
    } catch (error) {
      return null;
    }
  }

  async getLastActiveDateFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload: any = jwt.decode(refreshToken);
    return new Date(payload.iat * 1000).toISOString();
  }

  async getExpirationDateFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload: any = jwt.decode(refreshToken);
    return new Date(payload.exp * 1000).toISOString();
  }
}
