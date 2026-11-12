import { QRCodeSVG } from 'qrcode.react';
import { roomsData } from '../data/museumData';
import { ArrowLeft, Printer } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function QRGenerator({ onBack }: Props) {
  // Tomamos el origen actual (ej: http://localhost:5173)
  const baseUrl = window.location.origin;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-panel">
      <div className="qr-panel__header">
        <button className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Volver a la App
        </button>
        <button className="btn btn--primary" onClick={handlePrint}>
          <Printer size={16} aria-hidden="true" /> Imprimir QR
        </button>
      </div>

      <h2 className="qr-panel__title">Códigos QR de las Salas</h2>
      <p className="qr-panel__intro">
        Imprime o escanea estos códigos para probar el acceso directo a cada sala.
      </p>

      <div className="qr-grid">
        {roomsData.map((room) => {
          const roomUrl = `${baseUrl}/?sala=${room.id}`;
          return (
            <div key={room.id} className="qr-card">
              <h3 className="qr-card__name">{room.name.es}</h3>

              <div className="qr-card__frame">
                <QRCodeSVG value={roomUrl} size={150} level="H" includeMargin={true} />
              </div>

              <p className="qr-card__url">{roomUrl}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
