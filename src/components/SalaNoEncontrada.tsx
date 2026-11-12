/** RF-12 / RF-09: pantalla «Sala no encontrada» para un `?sala=` inexistente. */
export function SalaNoEncontrada() {
  return (
    <main className="view-enter" role="alert">
      <section className="detail-card">
        <h2 className="detail-title">Sala no encontrada</h2>
        <p className="detail-text">
          El código QR escaneado apunta a una sala que no existe o no está disponible.
          Consulta al personal del museo o vuelve a escanear otro código.
        </p>
      </section>
    </main>
  );
}
