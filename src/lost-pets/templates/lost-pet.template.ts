import { envs } from '../../config/envs';
import { CreateLostPetDto } from '../dtos/lost-pet.dto';

const escapeHtml = (value: string | number): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatAge = (age: number): string =>
  age === 1 ? '1 año' : `${escapeHtml(age)} años`;

const detailRow = (label: string, value: string): string => `
              <tr>
                <td style="padding:12px 20px;border-bottom:1px solid #eef0f4;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a93a5;white-space:nowrap;">${label}</td>
                <td style="padding:12px 20px;border-bottom:1px solid #eef0f4;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;color:#1b2233;text-align:right;">${value}</td>
              </tr>`;

const MAP_WIDTH = 536;
const MAP_HEIGHT = 240;
const MAP_ZOOM = 15;
const PHOTO_WIDTH = 536;

// Mapa estático renderizado a @2x para que se vea nítido en pantallas retina.
const buildMapImageUrl = (lat: number, lon: number): string =>
  `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/` +
  `pin-l+f0326d(${lon},${lat})/${lon},${lat},${MAP_ZOOM}/` +
  `${MAP_WIDTH}x${MAP_HEIGHT}@2x?access_token=${envs.MAPBOX_TOKEN}`;

export const generateLostPetTemplate = (
  createLostPetDto: CreateLostPetDto,
  imageUrl?: string,
): string => {
  const { type, name, phone, race, color } = createLostPetDto;
  // Con multipart/form-data lat, lon y age llegan como texto: se fuerzan a número
  // antes de armar URLs y de comparar la edad.
  const lat = Number(createLostPetDto.lat);
  const lon = Number(createLostPetDto.lon);
  const age = Number(createLostPetDto.age);

  const safeName = escapeHtml(name);
  const safeType = escapeHtml(type);
  const safePhone = escapeHtml(phone);
  const phoneHref = escapeHtml(String(phone).replace(/[^\d+]/g, ''));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`;
  const coords = `${escapeHtml(lat)}, ${escapeHtml(lon)}`;
  const mapImageUrl = escapeHtml(buildMapImageUrl(lat, lon));
  const photoBlock = imageUrl
    ? `
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #eef0f4;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(20,26,44,0.08);">
                <tr>
                  <td bgcolor="#e8eaf0" align="center" style="background-color:#e8eaf0;line-height:0;">
                    <img src="${escapeHtml(imageUrl)}" width="${PHOTO_WIDTH}" alt="Foto de ${safeName}" style="display:block;width:100%;max-width:${PHOTO_WIDTH}px;height:auto;border:0;outline:none;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5a6274;text-align:center;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background-color:#ffffff;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-family:Helvetica,Arial,sans-serif;">
                          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a93a5;">¿Has visto a</div>
                          <div style="font-size:20px;line-height:26px;font-weight:bold;color:#1b2233;padding-top:2px;">${safeName}?</div>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                          <span style="display:inline-block;background-color:#fff0f3;color:#f0326d;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:999px;border:1px solid #ffd3dc;">Perdido</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
`
    : '';
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Se busca: ${safeName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f4f8;">
  <div style="display:none;font-size:1px;color:#f2f4f8;max-height:0;overflow:hidden;">Se busca a ${safeName}, ${safeType} ${escapeHtml(race)} de color ${escapeHtml(color)}. Ayúdanos a encontrarlo.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f4f8;padding:32px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 28px rgba(20,26,44,0.10);">

          <!-- Header -->
          <tr>
            <td style="background-color:#ff5a5f;background-image:linear-gradient(135deg,#ff5a5f 0%,#f0326d 55%,#8b2ae0 100%);padding:36px 32px;text-align:center;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#ffe3e4;">Pet Radar · Alerta activa</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:40px;line-height:48px;font-weight:bold;color:#ffffff;padding-top:10px;">🐾 Se busca</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:22px;line-height:30px;color:#ffffff;padding-top:4px;">${safeName} necesita volver a casa</div>
            </td>
          </tr>
${photoBlock}
          <!-- Intro -->
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:26px;color:#4a5265;">
                Se reportó como perdido a <strong style="color:#1b2233;">${safeName}</strong>, un ${safeType} cerca de tu zona.
                Si lo has visto, cualquier dato cuenta. Aquí están sus señas:
              </p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:20px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafbfd;border:1px solid #eef0f4;border-radius:14px;">
${detailRow('Nombre', safeName)}
${detailRow('Especie', safeType)}
${detailRow('Raza', escapeHtml(race))}
${detailRow('Color', escapeHtml(color))}
${detailRow('Edad', formatAge(age))}
                <tr>
                  <td style="padding:12px 20px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a93a5;white-space:nowrap;">Contacto</td>
                  <td style="padding:12px 20px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;text-align:right;">
                    <a href="tel:${phoneHref}" style="color:#f0326d;text-decoration:none;">${safePhone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Map card -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #eef0f4;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 20px 12px 20px;background-color:#ffffff;">
                    <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a93a5;">Última ubicación conocida</div>
                    <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#1b2233;padding-top:4px;">${coords}</div>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#e8eaf0" style="background-color:#e8eaf0;line-height:0;">
                    <a href="${mapsUrl}" target="_blank" style="display:block;text-decoration:none;">
                      <img src="${mapImageUrl}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}" alt="Mapa de la última ubicación de ${safeName} en ${coords}" style="display:block;width:100%;max-width:${MAP_WIDTH}px;height:auto;border:0;outline:none;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5a6274;text-align:center;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f7f8fb;padding:6px 12px;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:#9aa2b4;text-align:right;">© Mapbox · © OpenStreetMap</td>
                </tr>
                <tr>
                  <td style="background-color:#1b2233;padding:0;">
                    <a href="${mapsUrl}" target="_blank" style="display:block;padding:16px 20px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;text-align:center;">📍 Abrir en Google Maps &rsaquo;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call CTA -->
          <tr>
            <td style="padding:16px 32px 0 32px;" align="center">
              <a href="tel:${phoneHref}" style="display:block;background-color:#f0326d;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:16px 24px;border-radius:12px;text-align:center;">📞 Llamar a ${safePhone}</a>
            </td>
          </tr>

          <!-- Tip -->
          <tr>
            <td style="padding:24px 32px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff5f6;border-left:4px solid #ff5a5f;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;color:#7a3040;">
                    <strong>¿Lo viste?</strong> No lo persigas. Mantén la distancia, toma una foto si puedes y llama al número de contacto con la hora y el lugar exactos.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1b2233;padding:24px 32px;text-align:center;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;">Pet Radar 🐾</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:20px;color:#8a93a5;padding-top:6px;">
                Recibes esta alerta porque estás cerca de la zona del reporte (${coords}).
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};
