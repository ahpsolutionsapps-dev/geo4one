import ColocacionesPage from "@/app/features/dashboards/colocaciones";

export default function SeguimientosPage() {
  return (
    <ColocacionesPage
      pageTitle="Seguimientos"
      entityLabel="seguimiento"
      entityPluralLabel="seguimientos"
      apiBasePath="/seguimientos"
    />
  );
}
