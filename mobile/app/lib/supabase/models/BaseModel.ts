/**
 * BaseModel pattern structure
 * This will be implemented in future stories when we need database operations
 * Following the pattern from the web app's BaseModel
 */

import { z } from "zod";
import { supabase } from "../client";

/**
 * BaseModel class structure
 * Will be fully implemented when database models are needed
 */
export abstract class BaseModel<T extends z.ZodType> {
  protected tableName: string;
  protected schema: T;

  constructor(tableName: string, schema: T) {
    this.tableName = tableName;
    this.schema = schema;
  }

  /**
   * Validate data against schema
   */
  protected validate(data: unknown): z.infer<T> {
    return this.schema.parse(data);
  }

  /**
   * Get Supabase client
   */
  protected getClient() {
    return supabase;
  }

  // Additional methods will be implemented in future stories
  // - getAll()
  // - getById()
  // - create()
  // - update()
  // - delete()
  // - etc.
}
