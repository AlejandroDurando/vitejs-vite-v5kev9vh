import type { CodigoItem, MatriculaItem } from '../types';

export const CODIGOS_DATA: CodigoItem[] = [
  { CODIGO: '101', DESCRIPCION: 'Laptop HP ProBook 450 G8', CATEGORIA: 'SUCURSALES' },
  { CODIGO: '102', DESCRIPCION: 'Monitor Dell 24 pulgadas', CATEGORIA: 'SUCURSALES' },
  { CODIGO: '103', DESCRIPCION: 'Teclado inalámbrico Logitech', CATEGORIA: 'SUCURSALES' },
  { CODIGO: '104', DESCRIPCION: 'Mouse óptico ergonómico', CATEGORIA: 'SUCURSALES' },
  { CODIGO: '105', DESCRIPCION: 'Impresora láser HP LaserJet', CATEGORIA: 'SUCURSALES' },

  { CODIGO: '151', DESCRIPCION: 'Escritorio ejecutivo de madera', CATEGORIA: 'AGENCIAS' },
  { CODIGO: '152', DESCRIPCION: 'Silla ergonómica con respaldo', CATEGORIA: 'AGENCIAS' },
  { CODIGO: '153', DESCRIPCION: 'Archivador metálico 4 cajones', CATEGORIA: 'AGENCIAS' },
  { CODIGO: '154', DESCRIPCION: 'Estantería modular 5 niveles', CATEGORIA: 'AGENCIAS' },
  { CODIGO: '155', DESCRIPCION: 'Mesa de reuniones 8 personas', CATEGORIA: 'AGENCIAS' },

  { CODIGO: '202', DESCRIPCION: 'Taladro percutor Bosch 800W', CATEGORIA: 'COMPRAS' },
  { CODIGO: '203', DESCRIPCION: 'Destornillador eléctrico Stanley', CATEGORIA: 'COMPRAS' },
  { CODIGO: '204', DESCRIPCION: 'Martillo de goma antideslizante', CATEGORIA: 'COMPRAS' },
  { CODIGO: '205', DESCRIPCION: 'Alicate universal 8 pulgadas', CATEGORIA: 'COMPRAS' },
  { CODIGO: '206', DESCRIPCION: 'Llave inglesa ajustable 12"', CATEGORIA: 'COMPRAS' },
  { CODIGO: '207', DESCRIPCION: 'Aceite lubricante WD-40 multiuso', CATEGORIA: 'COMPRAS' },
  { CODIGO: '208', DESCRIPCION: 'Cinta métrica retráctil 5m', CATEGORIA: 'COMPRAS' },

  { CODIGO: '301', DESCRIPCION: 'Vehículo Toyota Hilux 4x4', CATEGORIA: 'MOVILIDADES' },
  { CODIGO: '302', DESCRIPCION: 'Camioneta Ford Ranger XLT', CATEGORIA: 'MOVILIDADES' },
  { CODIGO: '303', DESCRIPCION: 'Motocicleta Honda CB190R', CATEGORIA: 'MOVILIDADES' },
  { CODIGO: '304', DESCRIPCION: 'Camión Isuzu NQR carga pesada', CATEGORIA: 'MOVILIDADES' },
  { CODIGO: '305', DESCRIPCION: 'Automóvil Nissan Versa sedán', CATEGORIA: 'MOVILIDADES' },
];

export const MATRICULAS_DATA: MatriculaItem[] = [
  { MATRICULA: 'ABC-123', MATERIAL: 'Toyota Hilux 4x4 2020', BIEN_DE_USO: 'Vehículo de transporte' },
  { MATRICULA: 'DEF-456', MATERIAL: 'Ford Ranger XLT 2021', BIEN_DE_USO: 'Camioneta de servicio' },
  { MATRICULA: 'GHI-789', MATERIAL: 'Honda CB190R 2022', BIEN_DE_USO: 'Motocicleta mensajería' },
  { MATRICULA: 'JKL-012', MATERIAL: 'Isuzu NQR 2019', BIEN_DE_USO: 'Camión de carga' },
  { MATRICULA: 'MNO-345', MATERIAL: 'Nissan Versa Sedán 2023', BIEN_DE_USO: 'Vehículo ejecutivo' },
  { MATRICULA: 'PQR-678', MATERIAL: 'Chevrolet N300 Van 2020', BIEN_DE_USO: 'Transporte de personal' },
  { MATRICULA: 'STU-901', MATERIAL: 'Mazda CX-5 AWD 2022', BIEN_DE_USO: 'Vehículo gerencial' },
  { MATRICULA: 'VWX-234', MATERIAL: 'Yamaha FZ16 2021', BIEN_DE_USO: 'Motocicleta operativa' },
];
