import { Page } from "@/components/shared/Page";

export interface BlankPageProps {
  title: string;
  description?: string;
}

export default function BlankPage({
  title,
  description = "Sección en construcción.",
}: BlankPageProps) {
  return (
    <Page title={title}>
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 rounded-2xl border border-dashed border-gray-300 bg-white p-6 dark:border-dark-500 dark:bg-dark-750">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-dark-200">
            {description}
          </p>
        </div>
      </div>
    </Page>
  );
}
