import { getFirebaseDb, getFirebaseStorage } from "./server";
import { FieldPath, type WhereFilterOp } from "firebase-admin/firestore";

export class FirestoreTableQuery {
  private tableName: string;
  private filters: Array<{ field: string; op: WhereFilterOp; value: unknown }> =
    [];
  private orderField?: string;
  private orderDirection?: "asc" | "desc";
  private limitNum?: number;
  private isSingle = false;
  private headMode = false;
  private mutationType: "select" | "insert" | "update" | "delete" = "select";
  private mutationPayload: unknown;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields = "*", options?: { count?: string; head?: boolean }) {
    void fields;
    if (options?.head) {
      this.headMode = true;
    }
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ field, op: "==", value });
    return this;
  }

  neq(field: string, value: unknown) {
    this.filters.push({ field, op: "!=", value });
    return this;
  }

  in(field: string, values: unknown[]) {
    if (values && values.length > 0) {
      this.filters.push({ field, op: "in", value: values });
    }
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderDirection = options?.ascending === false ? "desc" : "asc";
    return this;
  }

  limit(count: number) {
    this.limitNum = count;
    return this;
  }

  range(from: number, to: number) {
    this.limitNum = to - from + 1;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    this.limitNum = 1;
    return this.execute();
  }

  single() {
    this.isSingle = true;
    this.limitNum = 1;
    return this.execute();
  }

  insert(data: unknown) {
    this.mutationType = "insert";
    this.mutationPayload = data;
    return this;
  }

  upsert(data: unknown) {
    this.mutationType = "insert";
    this.mutationPayload = data;
    return this;
  }

  update(data: unknown) {
    this.mutationType = "update";
    this.mutationPayload = data;
    return this;
  }

  delete() {
    this.mutationType = "delete";
    return this;
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?:
      | ((value: {
          data: unknown;
          error: unknown;
          count?: number;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<{
    data: unknown;
    error: unknown;
    count?: number;
  }> {
    const db = getFirebaseDb();
    if (!db) {
      return { data: null, error: new Error("Firestore is not configured") };
    }

    try {
      if (this.mutationType === "insert") {
        const items = Array.isArray(this.mutationPayload)
          ? (this.mutationPayload as Record<string, unknown>[])
          : [this.mutationPayload as Record<string, unknown>];
        const inserted: Record<string, unknown>[] = [];

        for (const item of items) {
          const docId = item.id
            ? String(item.id)
            : db.collection(this.tableName).doc().id;
          const payload: Record<string, unknown> = {
            ...item,
            id: docId,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await db
            .collection(this.tableName)
            .doc(docId)
            .set(payload, { merge: true });
          inserted.push(payload);
        }

        return {
          data: Array.isArray(this.mutationPayload) ? inserted : inserted[0],
          error: null,
        };
      }

      // Query filters
      let q: FirebaseFirestore.Query = db.collection(this.tableName);

      for (const f of this.filters) {
        if (f.field === "id") {
          q = q.where(FieldPath.documentId(), f.op, String(f.value));
        } else {
          q = q.where(f.field, f.op, f.value);
        }
      }

      if (this.mutationType === "update") {
        const snap = await q.get();
        const updatePayload: Record<string, unknown> = {
          ...(this.mutationPayload as Record<string, unknown>),
          updated_at: new Date().toISOString(),
        };
        const batch = db.batch();
        snap.docs.forEach((d) =>
          batch.set(d.ref, updatePayload, { merge: true })
        );
        await batch.commit();
        return { data: this.mutationPayload, error: null };
      }

      if (this.mutationType === "delete") {
        const snap = await q.get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        return { data: null, error: null };
      }

      // SELECT
      if (this.orderField) {
        q = q.orderBy(this.orderField, this.orderDirection || "asc");
      }

      if (this.limitNum) {
        q = q.limit(this.limitNum);
      }

      let snap: FirebaseFirestore.QuerySnapshot;
      let usedFallback = false;
      try {
        snap = await q.get();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("requires an index") ||
          msg.includes("FAILED_PRECONDITION")
        ) {
          // Automatic in-memory fallback for composite queries to eliminate index requirements
          let fallbackQ: FirebaseFirestore.Query = db.collection(
            this.tableName
          );
          for (const f of this.filters) {
            if (f.field === "id") {
              fallbackQ = fallbackQ.where(
                FieldPath.documentId(),
                f.op,
                String(f.value)
              );
            } else {
              fallbackQ = fallbackQ.where(f.field, f.op, f.value);
            }
          }
          snap = await fallbackQ.get();
          usedFallback = true;
        } else {
          throw err;
        }
      }

      if (this.headMode) {
        return { data: null, error: null, count: snap.size };
      }

      let rows = snap.docs.map((doc) => {
        const d = doc.data();
        return { id: doc.id, ...d };
      });

      // Apply in-memory sort if fallback was used
      if (usedFallback && this.orderField) {
        const field = this.orderField;
        const dir = this.orderDirection === "desc" ? -1 : 1;
        rows.sort((a, b) => {
          const valA = (a as Record<string, unknown>)[field];
          const valB = (b as Record<string, unknown>)[field];
          if (valA === valB) return 0;
          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;
          return valA > valB ? dir : -dir;
        });
        if (this.limitNum && rows.length > this.limitNum) {
          rows = rows.slice(0, this.limitNum);
        }
      }

      if (this.isSingle) {
        return {
          data: rows[0] || null,
          error: null,
          count: snap.size,
        };
      }

      return {
        data: rows,
        error: null,
        count: snap.size,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Firestore query error on [${this.tableName}]:`, msg);
      return { data: null, error: err };
    }
  }
}

export class FirestoreStorageAdapter {
  from(bucketName: string) {
    return {
      async upload(
        filePath: string,
        buffer: Buffer,
        options?: { contentType?: string }
      ) {
        const storage = getFirebaseStorage();
        if (!storage) {
          return {
            data: null,
            error: new Error("Firebase Storage is not configured"),
          };
        }
        try {
          const bucket = storage.bucket();
          const destination = `${bucketName}/${filePath}`.replace(/^\/+/, "");
          const file = bucket.file(destination);
          await file.save(buffer, {
            contentType: options?.contentType || "application/octet-stream",
            public: true,
            metadata: {
              cacheControl: "public, max-age=31536000",
            },
          });
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
          return { data: { path: destination, publicUrl }, error: null };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`Firebase storage upload error:`, msg);
          return { data: null, error: err };
        }
      },
      async remove(paths: string[]) {
        const storage = getFirebaseStorage();
        if (!storage)
          return { data: null, error: new Error("Storage is not configured") };
        try {
          const bucket = storage.bucket();
          for (const p of paths) {
            const destination = `${bucketName}/${p}`.replace(/^\/+/, "");
            await bucket.file(destination).delete({ ignoreNotFound: true });
          }
          return { data: null, error: null };
        } catch (err: unknown) {
          return { data: null, error: err };
        }
      },
      getPublicUrl(filePath: string) {
        const storage = getFirebaseStorage();
        const bucket = storage?.bucket();
        const bucketNameStr = bucket?.name || "bjws-c99f1.firebasestorage.app";
        const destination = `${bucketName}/${filePath}`.replace(/^\/+/, "");
        return {
          data: {
            publicUrl: `https://storage.googleapis.com/${bucketNameStr}/${destination}`,
          },
        };
      },
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFirestoreClient(): any {
  return {
    from(tableName: string) {
      return new FirestoreTableQuery(tableName);
    },
    storage: new FirestoreStorageAdapter(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signOut: async () => {},
    },
    rpc: async () => ({ data: null, error: null }),
  };
}
