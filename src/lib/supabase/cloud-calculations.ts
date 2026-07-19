import { createClient } from "./client";

export type CloudCalculation = {
  id: string;
  user_id: string;
  name: string | null;
  calculation_date: string | null;
  payload: unknown;
  schema_version: number;
  created_at: string;
  updated_at: string;
};

export type CreateCloudCalculationInput = {
  name?: string;
  calculationDate?: string;
  payload: Record<string, unknown>;
};

export class CloudCalculationError extends Error {
  code: "unauthenticated" | "query_failed";

  constructor(
    code: "unauthenticated" | "query_failed",
    message: string,
  ) {
    super(message);
    this.name = "CloudCalculationError";
    this.code = code;
  }
}

const authenticatedClient = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new CloudCalculationError(
      "unauthenticated",
      "No authenticated user is available.",
    );
  }

  return { supabase, user: data.user };
};

export const listCloudCalculations = async (): Promise<
  CloudCalculation[]
> => {
  const { supabase, user } = await authenticatedClient();
  const { data, error } = await supabase
    .schema("public")
    .from("zakat_calculations")
    .select(
      "id,user_id,name,calculation_date,payload,schema_version,created_at,updated_at",
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new CloudCalculationError("query_failed", error.message);
  }

  return (data ?? []) as CloudCalculation[];
};

export const createCloudCalculation = async (
  input: CreateCloudCalculationInput,
): Promise<CloudCalculation> => {
  const { supabase, user } = await authenticatedClient();
  const { data, error } = await supabase
    .schema("public")
    .from("zakat_calculations")
    .insert({
      user_id: user.id,
      name: input.name?.trim() || null,
      calculation_date: input.calculationDate || null,
      payload: input.payload,
      schema_version: 1,
    })
    .select(
      "id,user_id,name,calculation_date,payload,schema_version,created_at,updated_at",
    )
    .single();

  if (error || !data) {
    throw new CloudCalculationError(
      "query_failed",
      error?.message ?? "The cloud calculation was not created.",
    );
  }

  return data as CloudCalculation;
};

export const deleteCloudCalculation = async (id: string): Promise<void> => {
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase
    .schema("public")
    .from("zakat_calculations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new CloudCalculationError("query_failed", error.message);
  }
};
