import {SupabaseClient} from "@supabase/supabase-js";
import {z} from "zod";
import {AppError} from "@/lib/app-error.ts";

/**
 * Defines a foreign relationship for the BaseModel.
 * - `key`: The name of the property in the Zod schema that holds the foreign data (e.g., 'sites').
 * - `nestedModel`: The nested model instance.
 * - `isArray`: The relationship type.
 * - `exclude`: If it should be excluded from upsert.
 * - `foreignKey`: The column name in the foreign table that links back to the primary table (e.g., 'customer_id' in 'customer_sites').
 */
export type Relation<K extends z.ZodType> = {
  key: string;
  nestedModel: BaseModel<K>;
  isArray?: boolean;
  exclude?: boolean;
  foreignKey: string;
};

export abstract class BaseModel<T extends z.ZodType> {
  protected readonly supabase: SupabaseClient;
  private readonly _tableName: string;
  private readonly _basePath: string;
  protected _schema: T;
  protected _id?: string | number;
  protected readonly relations: Relation<T>[];

  protected constructor(supabase: SupabaseClient, tableName: string, baseBath: string, schema: T, id?: string | number, relations: Relation<any>[] = []) {
    this.supabase = supabase;
    this._tableName = tableName;
    this._basePath = baseBath;
    this._schema = schema;
    this.relations = relations;

    if (id === 'new') {
      id = undefined;
    }
    this._id = id;
  }

  /**
   * Generates a Supabase select string including nested relations.
   * e.g., '*, sites(id, address, customer_id)'
   */
  protected generateSelectString(baseSelect: string = "*"): string {
    if (this.relations.length === 0) {
      return baseSelect;
    }

    // Start with the base select (e.g., all columns '*').
    let selectString = baseSelect;

    this.relations.forEach(rel => {
      // 1. Get the select string for the nested model recursively.
      // e.g., for CustomerSite, it might return 'id, address, projects(*)'
      const nestedSelect = rel.nestedModel.generateSelectString("*");

      // 2. Append the nested select string to the current level's string.
      // Supabase format: relationKey(nestedSelect)
      // e.g., 'sites(id, address, projects(*))'
      selectString += `, ${rel.key}:${rel.nestedModel._tableName}(${nestedSelect})`;
    });

    return selectString;
  }

  getAllQuery(select: string = "*") {
    const dynamicSelect = this.generateSelectString(select); // Use the dynamic select string
    return this.supabase.from(this._tableName).select(dynamicSelect as any, {count: "exact"}).eq("is_deleted", false);
  }

  /**
   * Default SELECT query
   */
  async getAll(select: string = "*") {
    const {data, error, count} = await this.getAllQuery(select);

    if (error) {
      throw new AppError(
          `Failed to retrieve all records for ${this._tableName}.`,
          error,
          {tableName: this._tableName, operation: 'FETCH'}
      );
    }

    const parsedData = z.array(this._schema).parse(data);
    return {data: parsedData as z.infer<T>[], count};
  }

  /**
   * Default SELECT query by id
   */
  async loadData(select: string = "*") {
    if (!this._id) {
      return null;
    }

    const selectString = this.generateSelectString(select);
    const {data, error} = await this.supabase
        .from(this._tableName)
        .select(selectString)
        .eq("id", this._id)
        .single();

    if (error) {
      throw new AppError(
          `Failed to retrieve record for ${this._tableName}.`,
          error,
          {tableName: this._tableName, operation: 'FETCH'}
      );
    }

    let parsed;
    try {
      parsed = this._schema.parse(data);
    } catch (error) {
      throw new AppError(
          `Failed to parse entity for ${this._tableName}.`,
          error,
          {tableName: this._tableName, operation: 'SCHEMA_PARSE'}
      );
    }

    return parsed;
  }

  /**
   * UPSERT (insert or update)
   * Handles nested relations by upserting them to their respective tables
   */
  async upsert(entity: Partial<z.infer<T>>) {
    if (!this._id) {
      // @ts-ignore
      entity.id = this._id;
    }

    // First, validate the entire entity
    let parsed;
    try {
      parsed = this._schema.parse(entity);
    } catch (error) {
      throw new AppError(
          `Failed to parse entity for ${this._tableName}.`,
          error,
          {tableName: this._tableName, operation: 'SCHEMA_PARSE'}
      );
    }

    // Separate main entity data from relation data
    const mainEntityData: Record<string, any> = {...(parsed as Record<string, any>)};
    const relationData: Record<string, any> = {};

    // Extract relation data from main entity
    this.relations.forEach(rel => {
      if (mainEntityData[rel.key] !== undefined) {
        relationData[rel.key] = mainEntityData[rel.key];
        delete mainEntityData[rel.key];
      }
    });

    // Upsert main entity first
    const {data: mainData, error: mainError} = await this.supabase
        .from(this._tableName)
        .upsert(mainEntityData)
        .select()
        .single();

    if (mainError) {
      throw new AppError(
          `Failed to save data to ${this._tableName}.`,
          mainError,
          {tableName: this._tableName, operation: 'UPSERT'}
      );
    }

    // Now handle relations
    for (const rel of this.relations) {
      if (rel.exclude) continue; //Skip excluded relations

      const relData = relationData[rel.key];

      const {error: deleteError} = await this.supabase
          .from(rel.nestedModel._tableName)
          .delete()
          .eq(rel.foreignKey, mainData.id);

      if (deleteError) {
        throw new AppError(
            `Failed to delete existing data from ${rel.nestedModel._tableName}`,
            deleteError,
            {tableName: rel.nestedModel._tableName, operation: 'DELETE'}
        );
      }

      if (relData !== undefined && relData !== null) {
        if (rel.isArray && Array.isArray(relData)) {
          // Handle array of relations (1:n or n:m)
          for (const item of relData) {
            // Set the foreign key to link back to parent
            const itemWithForeignKey = {
              ...item,
              [rel.foreignKey]: mainData.id
            };
            await rel.nestedModel.upsert(itemWithForeignKey);
          }
        } else if (!rel.isArray && relData) {
          // Handle single relation (1:1 or n:1)
          const itemWithForeignKey = {
            ...relData,
            [rel.foreignKey]: mainData.id
          };
          await rel.nestedModel.upsert(itemWithForeignKey);
        }
      }
    }

    return mainData;
  }

  /**
   * DELETE
   */
  async delete(id: number | string) {
    const {error} = await this.supabase
        .from(this._tableName)
        .upsert({
          'id': id,
          'is_deleted': true
        });

    if (error) {
      throw new AppError(
          `Failed to delete entry from ${this._tableName}.`,
          error,
          {tableName: this._tableName, operation: 'DELETE'}
      );
    }
  }

  get tableName(): string {
    return this._tableName;
  }

  get basePath(): string {
    return this._basePath;
  }

  get schema(): T {
    return this._schema;
  }

  set schema(value: T) {
    this._schema = value;
  }

  get id(): string | number | undefined {
    return this._id;
  }

  set id(value: string | number | undefined) {
    this._id = value;
  }
}
