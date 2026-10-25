import { generateLostPetTemplate } from './lost-pet.template';

// La plantilla solo necesita el token de Mapbox; se evita cargar todo el .env
jest.mock('../../config/envs', () => ({ envs: { MAPBOX_TOKEN: 'tok-falso' } }));

describe('generateLostPetTemplate', () => {
  const dto: any = {
    type: 'Perro',
    name: 'Fido',
    phone: '477-123 4567',
    race: 'Criollo',
    color: 'Café',
    ownerName: 'Santi',
    age: '1', // multipart lo manda como texto
    lat: '21.1',
    lon: '-101.6',
  };

  it('escapa el HTML de los datos que escribe el usuario', () => {
    const html = generateLostPetTemplate({
      ...dto,
      name: '"><script>x</script>',
      race: '<i>r</i>',
    });

    expect(html).not.toContain('<script>x</script>');
    expect(html).not.toContain('<i>r</i>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('el enlace de teléfono lleva solo dígitos y "+"', () => {
    expect(generateLostPetTemplate(dto)).toContain('href="tel:4771234567"');
  });

  it('muestra "1 año" aunque la edad llegue como texto', () => {
    expect(generateLostPetTemplate(dto)).toContain('1 año');
  });

  it('incluye la foto solo si hay URL, escapada', () => {
    expect(generateLostPetTemplate(dto)).not.toContain('Foto de Fido');

    const html = generateLostPetTemplate(dto, 'https://x/a.png" onerror="y');
    expect(html).toContain('Foto de Fido');
    expect(html).not.toContain('onerror="y');
  });
});
