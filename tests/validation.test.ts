import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  createTreeSchema,
  addOrnamentSchema,
} from '../src/lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('validates correct registration inputs', () => {
      const valid = {
        username: 'deniz_2026',
        displayName: 'Deniz Yılmaz',
        email: 'deniz@example.com',
        password: 'securepassword123',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('deniz_2026');
      }
    });

    it('rejects invalid usernames with spaces or special characters', () => {
      const invalid = {
        username: 'deniz 2026!',
        displayName: 'Deniz',
        email: 'deniz@example.com',
        password: 'password123',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
      const invalid = {
        username: 'deniz_yilmaz',
        displayName: 'Deniz',
        email: 'deniz@example.com',
        password: '123',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createTreeSchema', () => {
    it('accepts valid tree themes and names', () => {
      const valid = {
        treeName: "Elif'in Yılbaşı Ağacı",
        theme: 'snowy',
        acceptMessages: true,
      };
      const result = createTreeSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid theme names', () => {
      const invalid = {
        treeName: "Ağaç",
        theme: 'rainbow',
        acceptMessages: true,
      };
      const result = createTreeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addOrnamentSchema', () => {
    it('validates ornament placement coordinates within valid tree canopy', () => {
      const valid = {
        treeId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        ornamentType: 'gold_ball',
        positionX: 50,
        positionY: 50,
        senderName: 'Mert',
        messageContent: 'Mutlu yıllar dilerim!',
        isAnonymous: false,
      };
      const result = addOrnamentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects coordinates outside allowed bounds', () => {
      const invalid = {
        treeId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        ornamentType: 'star',
        positionX: 99,
        positionY: 99,
        senderName: 'Mert',
        messageContent: 'Test',
        isAnonymous: false,
      };
      const result = addOrnamentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
