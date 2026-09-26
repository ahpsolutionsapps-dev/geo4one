import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, Resolver } from "react-hook-form";
import { AnyObjectSchema } from "yup";

export function typedYupResolver<TFieldValues extends FieldValues>(
  schema: AnyObjectSchema,
): Resolver<TFieldValues> {
  return yupResolver(schema) as Resolver<TFieldValues>;
}
