type SqlClient = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

export async function nextSyncSeq(
  prisma: SqlClient,
  sequenceName: string,
): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<Array<{ next: bigint | number }>>(
    `SELECT nextval('"${sequenceName}"') as next`,
  );
  return Number(rows[0]?.next ?? 0);
}
