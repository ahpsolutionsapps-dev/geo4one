import UbicacionesModulePage from "../components/UbicacionesModulePage";

export default function MunicipiosPage() {
  return (
    <UbicacionesModulePage
      title="Municipios"
      description="Registro de municipios agrupados por provincia. Mantiene la relación jerárquica con el catálogo geográfico principal."
      fields={[
        {
          name: "IdMunicipio",
          description: "Identificador único del municipio.",
          required: true,
        },
        {
          name: "IdProvincia",
          description: "Provincia a la que pertenece el municipio.",
          required: true,
        },
        {
          name: "Municipio",
          description: "Nombre del municipio.",
          required: true,
        },
        {
          name: "Latitud",
          description: "Coordenada geográfica de referencia.",
        },
        {
          name: "Longitud",
          description: "Coordenada geográfica de referencia.",
        },
        {
          name: "Activo",
          description: "Indica si el municipio está habilitado.",
          required: true,
        },
        {
          name: "FechaCreacion",
          description: "Fecha de alta del registro.",
          required: true,
        },
        {
          name: "FechaActualizacion",
          description: "Última fecha de modificación.",
          required: true,
        },
        {
          name: "CreadoPor",
          description: "Usuario que registró el municipio.",
        },
        {
          name: "ActualizadoPor",
          description: "Usuario que actualizó el municipio.",
        },
      ]}
    />
  );
}
