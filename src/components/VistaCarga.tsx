interface Props {
  /** Texto de la etiqueta de estado («Cargando salas…», «Verificando sesión…»). */
  label: string;
  /** `status` para cargas neutras; `alert` para errores bloqueantes (RF-09). */
  role?: 'status' | 'alert';
}

/** RF-12: estado de carga minimalista reutilizable (RF-06 / RF-08). */
export function VistaCarga({ label, role = 'status' }: Props) {
  return (
    <main className="view-enter" role={role} aria-live={role === 'status' ? 'polite' : undefined}>
      <p className="section-label">{label}</p>
      <div className="loader" aria-hidden="true" />
    </main>
  );
}
