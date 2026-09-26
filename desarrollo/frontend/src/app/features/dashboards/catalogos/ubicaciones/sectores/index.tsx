import UbicacionesModulePage from "../components/UbicacionesModulePage";

export default function SectoresPage() {
  return (
    <UbicacionesModulePage
      title="Sectores"
      description="Registro de sectores y barrios asociados a un municipio. Este módulo completa el tercer nivel de la jerarquía geográfica."
      fields={[
        {
          name: "IdSectorBarrio",
          description: "Identificador único del sector o barrio.",
          required: true,
        },
        {
          name: "IdMunicipio",
          description: "Municipio al que pertenece el sector.",
          required: true,
        },
        {
          name: "SectorBarrio",
          description: "Nombre del sector o barrio.",
          required: true,
        },
        {
          name: "Circunscripcion",
          description: "Número o etiqueta de circunscripción.",
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
          description: "Indica si el sector está habilitado.",
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
          description: "Usuario que registró el sector.",
        },
        {
          name: "ActualizadoPor",
          description: "Usuario que actualizó el sector.",
        },
      ]}
    />
  );
}
