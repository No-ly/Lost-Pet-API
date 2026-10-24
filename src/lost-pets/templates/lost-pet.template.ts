import { envs } from '../../config/envs';
import { CreateLostPetDto } from '../dtos/create-lost-pet.dto';

// Previene ataques de inyección de código (XSS) limpiando caracteres especiales
const escapeHtml = (value: string | number): string => {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// Construye la URL de la imagen estática de Mapbox
const buildMapImageUrl = (lat: number, lon: number): string => {
    const zoom = 14;
    const width = 500;
    const height = 300;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-dog+f00(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${envs.MAPBOX_TOKEN}`;
};

export const generateLostPetTemplate = (
    createLostPetDto: CreateLostPetDto,
): string => {
    const { type, name, lat, lon, phone, race, age, color, ownerName } = createLostPetDto;

    const safeName = escapeHtml(name);
    const safeType = escapeHtml(type);
    const safePhone = escapeHtml(phone);

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    const mapImageUrl = escapeHtml(buildMapImageUrl(lat, lon));

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #d9534f; text-align: center;">🚨 ¡Mascota Perdida Alerta!</h2>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Nombre:</strong> ${safeName}</p>
        <p style="margin: 5px 0;"><strong>Tipo:</strong> ${safeType} (${escapeHtml(race)})</p>
        <p style="margin: 5px 0;"><strong>Color:</strong> ${escapeHtml(color)} | <strong>Edad:</strong> ${escapeHtml(age)} años</p>
        <p style="margin: 5px 0;"><strong>Dueño:</strong> ${escapeHtml(ownerName)}</p>
        <p style="margin: 5px 0;"><strong>Teléfono:</strong> <a href="tel:${safePhone}" style="color: #0275d8; text-decoration: none;">${safePhone}</a></p>
      </div>

      <div style="text-align: center;">
        <a href="${mapsUrl}" target="_blank">
          <img src="${mapImageUrl}" alt="Ubicación aproximada de ${safeName}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ccc;" />
        </a>
        <br />
        <a href="${mapsUrl}" target="_blank" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #0275d8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Ver en Google Maps
        </a>
      </div>
    </div>
  `;
};