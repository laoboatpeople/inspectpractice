import { z } from 'zod';

/**
 * Database ids may be standard UUIDs (with dashes) OR 32-hex dashless ids
 * (some exam banks were seeded with stripped UUIDs, e.g. the NHIE exam on
 * inspectpractice). Validation must accept both, since lookups are plain
 * string matches against the stored value.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX32_RE = /^[0-9a-f]{32}$/i;

export const dbIdSchema = z
  .string()
  .refine((v) => UUID_RE.test(v) || HEX32_RE.test(v), 'Invalid ID');
