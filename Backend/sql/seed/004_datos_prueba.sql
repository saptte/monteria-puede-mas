-- Datos de prueba de Montería Puede Más.
-- Sirven para que el asistente consulte reportes, barrios y obras reales de la base.
-- Se puede volver a ejecutar: no duplica casos ni barrios.

INSERT INTO citizen.citizen (citizen_id, first_name, last_name, email, phone, status)
VALUES
  ('c1111111-1111-4111-8111-111111111001', 'Ana', 'Prueba', 'ana.prueba@monteria-pdm.test', '3000000001', 'ACTIVO'),
  ('c1111111-1111-4111-8111-111111111002', 'Carlos', 'Prueba', 'carlos.prueba@monteria-pdm.test', '3000000002', 'ACTIVO'),
  ('c1111111-1111-4111-8111-111111111003', 'Luisa', 'Prueba', 'luisa.prueba@monteria-pdm.test', '3000000003', 'ACTIVO'),
  ('c1111111-1111-4111-8111-111111111004', 'Mario', 'Prueba', 'mario.prueba@monteria-pdm.test', '3000000004', 'ACTIVO'),
  ('c1111111-1111-4111-8111-111111111005', 'Sofía', 'Prueba', 'sofia.prueba@monteria-pdm.test', '3000000005', 'ACTIVO'),
  ('c1111111-1111-4111-8111-111111111006', 'Andrés', 'Prueba', 'andres.prueba@monteria-pdm.test', '3000000006', 'ACTIVO')
ON CONFLICT (email) DO NOTHING;

UPDATE catalog.neighborhood SET commune = v.commune, locality = 'Montería'
FROM (VALUES
  ('La Granja', 'Comuna 6'),
  ('Brisas del Sinú', 'Comuna 8')
) AS v(name, commune)
WHERE catalog.neighborhood.name = v.name;

INSERT INTO catalog.neighborhood (neighborhood_id, name, commune, locality)
VALUES
  ('a1111111-1111-4111-8111-111111111001', 'Centro', 'Comuna 1', 'Montería'),
  ('a1111111-1111-4111-8111-111111111002', 'El Recreo', 'Comuna 4', 'Montería'),
  ('a1111111-1111-4111-8111-111111111003', 'Mocarí', 'Comuna 7', 'Montería'),
  ('a1111111-1111-4111-8111-111111111004', 'Pasatiempo', 'Comuna 5', 'Montería'),
  ('a1111111-1111-4111-8111-111111111005', 'La Castellana', 'Comuna 4', 'Montería'),
  ('a1111111-1111-4111-8111-111111111006', 'Sucre', 'Comuna 2', 'Montería'),
  ('a1111111-1111-4111-8111-111111111007', 'Mogambo', 'Comuna 8', 'Montería'),
  ('a1111111-1111-4111-8111-111111111008', 'Cantaclaro', 'Comuna 3', 'Montería'),
  ('a1111111-1111-4111-8111-111111111009', 'La Julia', 'Comuna 6', 'Montería'),
  ('a1111111-1111-4111-8111-111111111010', 'Los Garzones', 'Comuna 9', 'Montería'),
  ('a1111111-1111-4111-8111-111111111011', 'Los Álamos', 'Comuna 5', 'Montería'),
  ('a1111111-1111-4111-8111-111111111012', 'Villa Cielo', 'Comuna 9', 'Montería'),
  ('a1111111-1111-4111-8111-111111111013', 'Nueva Lucía', 'Comuna 7', 'Montería'),
  ('a1111111-1111-4111-8111-111111111014', 'El Prado', 'Comuna 2', 'Montería'),
  ('a1111111-1111-4111-8111-111111111015', 'Kennedy', 'Comuna 3', 'Montería'),
  ('a1111111-1111-4111-8111-111111111016', 'Furatena', 'Comuna 6', 'Montería'),
  ('a1111111-1111-4111-8111-111111111017', 'Rancho Grande', 'Comuna 4', 'Montería'),
  ('a1111111-1111-4111-8111-111111111018', 'Sevilla', 'Comuna 5', 'Montería'),
  ('a1111111-1111-4111-8111-111111111019', 'Urbina', 'Comuna 8', 'Montería'),
  ('a1111111-1111-4111-8111-111111111020', 'Santa Fe', 'Comuna 1', 'Montería'),
  ('a1111111-1111-4111-8111-111111111021', 'La Esperanza', 'Comuna 9', 'Montería'),
  ('a1111111-1111-4111-8111-111111111022', 'El Dorado', 'Comuna 7', 'Montería'),
  ('a1111111-1111-4111-8111-111111111023', 'Vallejo', 'Comuna 6', 'Montería')
ON CONFLICT (name, commune) DO NOTHING;

CREATE TEMP TABLE seed_report (
  case_number text PRIMARY KEY,
  email text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  priority text NOT NULL,
  barrio text NOT NULL,
  address text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  days_ago int NOT NULL,
  entity text NOT NULL
);

INSERT INTO seed_report VALUES
  ('MPM-2026-010001', 'ana.prueba@monteria-pdm.test', 'basuras', 'Bolsas acumuladas en la calle 29', 'Desde hace varios días hay bolsas de basura en la calle 29 con carrera 12. El camión no las recoge y ya hay mal olor.', 'RECIBIDO', 'HIGH', 'Vallejo', 'Calle 29 con carrera 12', 8.7464, -75.8686, 2, 'Servigenerales de Montería'),
  ('MPM-2026-010002', 'carlos.prueba@monteria-pdm.test', 'basuras', 'Escombros junto a la cancha', 'Dejaron escombros y costales al lado de la cancha. Los niños juegan ahí y el paso está cerrado.', 'EN_EJECUCION', 'HIGH', 'Vallejo', 'Cancha del barrio Vallejo', 8.7468, -75.8692, 11, 'Servigenerales de Montería'),
  ('MPM-2026-010003', 'luisa.prueba@monteria-pdm.test', 'basuras', 'Lote con residuos junto al caño', 'El lote de la esquina del caño se está usando como botadero. Cuando llueve la basura baja a la calle.', 'ASIGNADO', 'MEDIUM', 'Vallejo', 'Caño de la entrada del barrio', 8.7456, -75.8681, 18, 'Servigenerales de Montería'),
  ('MPM-2026-010004', 'mario.prueba@monteria-pdm.test', 'alumbrado', 'Poste apagado en la carrera 12', 'El poste de la carrera 12 lleva más de una semana apagado. La cuadra queda oscura después de las siete.', 'EN_REVISION', 'MEDIUM', 'Vallejo', 'Carrera 12 entre calles 28 y 29', 8.7460, -75.8690, 6, 'Alumbrado público'),
  ('MPM-2026-010005', 'sofia.prueba@monteria-pdm.test', 'alumbrado', 'Luminaria reparada de la calle principal', 'La luminaria de la calle principal ya volvió a encender. El caso quedó cerrado.', 'RESUELTO', 'LOW', 'Vallejo', 'Calle principal de Vallejo', 8.7470, -75.8684, 40, 'Alumbrado público'),
  ('MPM-2026-010006', 'andres.prueba@monteria-pdm.test', 'vias', 'Hueco frente a la tienda', 'Hay un hueco hondo frente a la tienda de la esquina. Las motos tienen que esquivarlo.', 'RECIBIDO', 'HIGH', 'Vallejo', 'Tienda de la esquina, Vallejo', 8.7459, -75.8694, 1, 'Secretaría de Infraestructura'),
  ('MPM-2026-010007', 'ana.prueba@monteria-pdm.test', 'basuras', 'Basura en los alrededores del mercado', 'Al cierre del mercado quedan cajas y residuos en el andén. A la mañana siguiente siguen ahí.', 'EN_EJECUCION', 'HIGH', 'Centro', 'Mercado del centro', 8.7501, -75.8831, 4, 'Servigenerales de Montería'),
  ('MPM-2026-010008', 'carlos.prueba@monteria-pdm.test', 'basuras', 'Puntos de reciclaje desbordados', 'Los puntos de la calle 41 se llenan antes del mediodía y la basura queda por fuera.', 'ASIGNADO', 'MEDIUM', 'Centro', 'Calle 41 del centro', 8.7492, -75.8840, 9, 'Servigenerales de Montería'),
  ('MPM-2026-010009', 'luisa.prueba@monteria-pdm.test', 'movilidad', 'Semáforo dañado en la calle 27', 'El semáforo de la calle 27 con la avenida principal se queda en intermitente en hora pico.', 'EN_EJECUCION', 'HIGH', 'Centro', 'Calle 27 con avenida principal', 8.7498, -75.8828, 7, 'Secretaría de Tránsito'),
  ('MPM-2026-010010', 'mario.prueba@monteria-pdm.test', 'movilidad', 'Paradero de buses sin techo', 'El paradero de la carrera 3 no tiene techo y la gente espera el bus en la calzada.', 'RECIBIDO', 'MEDIUM', 'Centro', 'Carrera 3, paradero del centro', 8.7488, -75.8838, 3, 'Secretaría de Tránsito'),
  ('MPM-2026-010011', 'sofia.prueba@monteria-pdm.test', 'vias', 'Hueco en la calle 41', 'Un hueco en la calle 41 ya se marcó y está pendiente de tapar. Pasa el tráfico pesado.', 'VALIDADO', 'HIGH', 'Centro', 'Calle 41 entre carreras 2 y 3', 8.7496, -75.8844, 14, 'Secretaría de Infraestructura'),
  ('MPM-2026-010012', 'andres.prueba@monteria-pdm.test', 'seguridad', 'Ruido nocturno en el parque', 'Los fines de semana el parque del centro queda con ruido alto hasta tarde. Los vecinos piden control.', 'EN_REVISION', 'LOW', 'Centro', 'Parque del centro', 8.7504, -75.8822, 5, 'Inspección de Policía'),
  ('MPM-2026-010013', 'ana.prueba@monteria-pdm.test', 'vias', 'Vía principal con varios huecos', 'La vía principal de La Granja tiene una hilera de huecos. Los carros pasan por el andén.', 'EN_EJECUCION', 'HIGH', 'La Granja', 'Vía principal de La Granja', 8.7388, -75.8722, 8, 'Secretaría de Infraestructura'),
  ('MPM-2026-010014', 'carlos.prueba@monteria-pdm.test', 'vias', 'Hundimiento a la entrada del barrio', 'A la entrada hay un hundimiento que se llena de agua. Ya está asignado a la cuadrilla.', 'ASIGNADO', 'HIGH', 'La Granja', 'Entrada de La Granja', 8.7392, -75.8730, 16, 'Secretaría de Infraestructura'),
  ('MPM-2026-010015', 'luisa.prueba@monteria-pdm.test', 'vias', 'Tapa de alcantarilla suelta', 'La tapa de una alcantarilla quedó suelta y se mueve cuando pasa una moto.', 'RECIBIDO', 'HIGH', 'La Granja', 'Calle interna de La Granja', 8.7381, -75.8718, 2, 'Secretaría de Infraestructura'),
  ('MPM-2026-010016', 'mario.prueba@monteria-pdm.test', 'alumbrado', 'Dos postes apagados en la cuadra 4', 'En la cuadra 4 hay dos postes apagados desde el domingo.', 'RECIBIDO', 'MEDIUM', 'La Granja', 'Cuadra 4 de La Granja', 8.7378, -75.8728, 3, 'Alumbrado público'),
  ('MPM-2026-010017', 'sofia.prueba@monteria-pdm.test', 'parques', 'Juegos infantiles dañados', 'El columpio y un pasamanos del parque están rotos. Los niños siguen usándolos.', 'EN_EJECUCION', 'MEDIUM', 'Brisas del Sinú', 'Parque de Brisas del Sinú', 8.7758, -75.8852, 10, 'Espacio público'),
  ('MPM-2026-010018', 'andres.prueba@monteria-pdm.test', 'parques', 'Poda del parque terminada', 'Ya podaron los árboles que tapaban la luz del parque. El caso se cerró.', 'RESUELTO', 'LOW', 'Brisas del Sinú', 'Zona verde de Brisas del Sinú', 8.7752, -75.8860, 28, 'Espacio público'),
  ('MPM-2026-010019', 'ana.prueba@monteria-pdm.test', 'agua', 'Alcantarilla destapada', 'La alcantarilla de la calle baja se destapó y el agua ya corre. Quedó resuelto.', 'RESUELTO', 'MEDIUM', 'Brisas del Sinú', 'Calle baja de Brisas del Sinú', 8.7748, -75.8848, 35, 'Acueducto y alcantarillado'),
  ('MPM-2026-010020', 'carlos.prueba@monteria-pdm.test', 'agua', 'Rebose cuando llueve fuerte', 'Con lluvia fuerte el agua sale por la tapa y se mete a las casas de la parte baja.', 'EN_EJECUCION', 'HIGH', 'Brisas del Sinú', 'Parte baja de Brisas del Sinú', 8.7762, -75.8858, 6, 'Acueducto y alcantarillado'),
  ('MPM-2026-010021', 'luisa.prueba@monteria-pdm.test', 'alumbrado', 'Cuadra completa a oscuras', 'Una cuadra de Mocarí amanece a oscuras. La cuadrilla ya está cambiando las luminarias.', 'EN_EJECUCION', 'HIGH', 'Mocarí', 'Calle central de Mocarí', 8.7658, -75.8942, 9, 'Alumbrado público'),
  ('MPM-2026-010022', 'mario.prueba@monteria-pdm.test', 'alumbrado', 'Poste intermitente frente al colegio', 'El poste frente al colegio prende y se apaga. Ya tiene responsable asignado.', 'ASIGNADO', 'MEDIUM', 'Mocarí', 'Frente al colegio de Mocarí', 8.7651, -75.8950, 13, 'Alumbrado público'),
  ('MPM-2026-010023', 'sofia.prueba@monteria-pdm.test', 'alumbrado', 'Luminaria rota en el parque', 'La luminaria del parque está rota y el bombillo cuelga.', 'RECIBIDO', 'MEDIUM', 'Mocarí', 'Parque de Mocarí', 8.7662, -75.8938, 1, 'Alumbrado público'),
  ('MPM-2026-010024', 'andres.prueba@monteria-pdm.test', 'basuras', 'Contenedor desbordado', 'El contenedor de la entrada se desborda los martes y la basura queda en la vía.', 'RECIBIDO', 'MEDIUM', 'Mocarí', 'Entrada de Mocarí', 8.7648, -75.8948, 4, 'Servigenerales de Montería'),
  ('MPM-2026-010025', 'ana.prueba@monteria-pdm.test', 'agua', 'Inundación en la calle principal', 'Cada aguacero inunda la calle principal. El agua llega al andén de las casas.', 'EN_EJECUCION', 'HIGH', 'Cantaclaro', 'Calle principal de Cantaclaro', 8.7538, -75.8952, 5, 'Acueducto y alcantarillado'),
  ('MPM-2026-010026', 'carlos.prueba@monteria-pdm.test', 'agua', 'Caño sin limpieza', 'El caño tiene sedimento y no da abasto. Ya está asignada la limpieza.', 'ASIGNADO', 'HIGH', 'Cantaclaro', 'Caño de Cantaclaro', 8.7531, -75.8960, 15, 'Acueducto y alcantarillado'),
  ('MPM-2026-010027', 'luisa.prueba@monteria-pdm.test', 'agua', 'Charco permanente en la esquina', 'En la esquina queda un charco que no seca y cría zancudos.', 'RECIBIDO', 'MEDIUM', 'Cantaclaro', 'Esquina de la tienda, Cantaclaro', 8.7542, -75.8948, 3, 'Acueducto y alcantarillado'),
  ('MPM-2026-010028', 'mario.prueba@monteria-pdm.test', 'vias', 'Calzada partida después de la lluvia', 'La calzada se partió después de la última lluvia y quedó un borde peligroso.', 'RECIBIDO', 'MEDIUM', 'Cantaclaro', 'Calle interna de Cantaclaro', 8.7528, -75.8956, 8, 'Secretaría de Infraestructura'),
  ('MPM-2026-010029', 'sofia.prueba@monteria-pdm.test', 'seguridad', 'Discusión recurrente en la cancha', 'En la cancha hay peleas los domingos en la tarde. Los vecinos piden presencia.', 'EN_REVISION', 'MEDIUM', 'El Recreo', 'Cancha de El Recreo', 8.7578, -75.8672, 6, 'Inspección de Policía'),
  ('MPM-2026-010030', 'andres.prueba@monteria-pdm.test', 'basuras', 'Basura detrás de las casas', 'Detrás de una hilera de casas botan bolsas. El olor llega a los patios.', 'RECIBIDO', 'MEDIUM', 'El Recreo', 'Parte de atrás de El Recreo', 8.7571, -75.8680, 4, 'Servigenerales de Montería'),
  ('MPM-2026-010031', 'ana.prueba@monteria-pdm.test', 'parques', 'Cancha sin malla', 'La malla de la cancha está caída en un costado. Ya empezaron a cambiarla.', 'EN_EJECUCION', 'LOW', 'El Recreo', 'Cancha de El Recreo', 8.7582, -75.8668, 12, 'Espacio público'),
  ('MPM-2026-010032', 'carlos.prueba@monteria-pdm.test', 'parques', 'Andenes del parque rotos', 'Varias losas del parque están sueltas y la gente tropieza de noche.', 'EN_EJECUCION', 'MEDIUM', 'Pasatiempo', 'Parque de Pasatiempo', 8.7428, -75.9012, 9, 'Espacio público'),
  ('MPM-2026-010033', 'luisa.prueba@monteria-pdm.test', 'parques', 'Banca destruida', 'Una banca del parque está partida. Sigue en el sitio y estorba el paso.', 'RECIBIDO', 'LOW', 'Pasatiempo', 'Parque de Pasatiempo', 8.7422, -75.9020, 2, 'Espacio público'),
  ('MPM-2026-010034', 'mario.prueba@monteria-pdm.test', 'equipamientos', 'Salón comunal con goteras', 'El salón comunal tiene goteras en el techo. Ya asignaron la revisión.', 'ASIGNADO', 'MEDIUM', 'Pasatiempo', 'Salón comunal de Pasatiempo', 8.7431, -75.9008, 20, 'Secretaría de Infraestructura'),
  ('MPM-2026-010035', 'sofia.prueba@monteria-pdm.test', 'vias', 'Huecos en la avenida del barrio', 'La avenida tiene tres huecos seguidos. La cuadrilla ya está en la zona.', 'EN_EJECUCION', 'HIGH', 'La Castellana', 'Avenida de La Castellana', 8.7628, -75.8612, 7, 'Secretaría de Infraestructura'),
  ('MPM-2026-010036', 'andres.prueba@monteria-pdm.test', 'movilidad', 'Cruce sin cebras', 'El cruce de la entrada no tiene cebra y los carros no paran.', 'RECIBIDO', 'MEDIUM', 'La Castellana', 'Entrada de La Castellana', 8.7621, -75.8620, 5, 'Secretaría de Tránsito'),
  ('MPM-2026-010037', 'ana.prueba@monteria-pdm.test', 'alumbrado', 'Poste de la portería reparado', 'Cambiaron la luminaria de la portería. La calle ya no queda oscura.', 'RESUELTO', 'LOW', 'La Castellana', 'Portería de La Castellana', 8.7632, -75.8608, 30, 'Alumbrado público'),
  ('MPM-2026-010038', 'carlos.prueba@monteria-pdm.test', 'basuras', 'Recolección que no pasa los jueves', 'El camión dejó de pasar los jueves. Las bolsas se quedan dos días en la puerta.', 'EN_EJECUCION', 'HIGH', 'Sucre', 'Calle principal de Sucre', 8.7418, -75.8892, 6, 'Servigenerales de Montería'),
  ('MPM-2026-010039', 'luisa.prueba@monteria-pdm.test', 'agua', 'Baja presión en las mañanas', 'En la mañana el agua sale con muy poca presión en la parte alta del barrio.', 'RECIBIDO', 'MEDIUM', 'Sucre', 'Parte alta de Sucre', 8.7412, -75.8900, 3, 'Acueducto y alcantarillado'),
  ('MPM-2026-010040', 'mario.prueba@monteria-pdm.test', 'movilidad', 'Ruta de bus que ya no entra', 'La ruta que entraba al barrio ahora deja a la gente en la avenida. Piden que vuelva a entrar.', 'EN_EJECUCION', 'MEDIUM', 'Mogambo', 'Avenida de Mogambo', 8.7718, -75.8762, 11, 'Secretaría de Tránsito'),
  ('MPM-2026-010041', 'sofia.prueba@monteria-pdm.test', 'vias', 'Calle destapada en la salida', 'La salida del barrio está destapada y con piedra suelta.', 'RECIBIDO', 'MEDIUM', 'Mogambo', 'Salida de Mogambo', 8.7711, -75.8770, 4, 'Secretaría de Infraestructura'),
  ('MPM-2026-010042', 'andres.prueba@monteria-pdm.test', 'basuras', 'Esquina usada como botadero', 'Una esquina se volvió botadero de muebles viejos y bolsas.', 'RECIBIDO', 'MEDIUM', 'La Julia', 'Esquina de La Julia', 8.7338, -75.8792, 5, 'Servigenerales de Montería'),
  ('MPM-2026-010043', 'ana.prueba@monteria-pdm.test', 'ideas', 'Punto de reciclaje para el barrio', 'Proponen un punto de reciclaje junto al salón comunal para separar plástico y cartón.', 'VALIDADO', 'LOW', 'La Julia', 'Salón comunal de La Julia', 8.7332, -75.8800, 12, 'Oficina de participación'),
  ('MPM-2026-010044', 'carlos.prueba@monteria-pdm.test', 'alumbrado', 'Poste nuevo sin conectar', 'Instalaron un poste en la entrada y todavía no lo conectan.', 'RECIBIDO', 'MEDIUM', 'Los Garzones', 'Entrada de Los Garzones', 8.7858, -75.8652, 8, 'Alumbrado público'),
  ('MPM-2026-010045', 'luisa.prueba@monteria-pdm.test', 'equipamientos', 'Centro de salud con fila en la calle', 'La fila del centro de salud sale a la calle porque la sala de espera no da abasto.', 'EN_REVISION', 'MEDIUM', 'Los Garzones', 'Centro de salud de Los Garzones', 8.7851, -75.8660, 9, 'Secretaría de Infraestructura'),
  ('MPM-2026-010046', 'mario.prueba@monteria-pdm.test', 'parques', 'Zona verde sin mantenimiento', 'La zona verde tiene monte alto y no se ve la acera.', 'RECIBIDO', 'LOW', 'Los Álamos', 'Zona verde de Los Álamos', 8.7478, -75.9072, 7, 'Espacio público'),
  ('MPM-2026-010047', 'sofia.prueba@monteria-pdm.test', 'seguridad', 'Cuadra poco iluminada y sola', 'Una cuadra queda sola y oscura. Piden revisión de convivencia, no solo de luz.', 'VALIDADO', 'MEDIUM', 'Los Álamos', 'Cuadra final de Los Álamos', 8.7471, -75.9080, 14, 'Inspección de Policía'),
  ('MPM-2026-010048', 'andres.prueba@monteria-pdm.test', 'agua', 'Agua estancada en la bomba', 'Junto a la bomba queda agua estancada aunque no llueva.', 'RECIBIDO', 'MEDIUM', 'Villa Cielo', 'Bomba de Villa Cielo', 8.7798, -75.8712, 3, 'Acueducto y alcantarillado'),
  ('MPM-2026-010049', 'ana.prueba@monteria-pdm.test', 'basuras', 'Recolección atrasada', 'El camión lleva tres turnos sin pasar. Ya están reorganizando la ruta.', 'EN_EJECUCION', 'HIGH', 'Villa Cielo', 'Calle 1 de Villa Cielo', 8.7791, -75.8720, 6, 'Servigenerales de Montería'),
  ('MPM-2026-010050', 'carlos.prueba@monteria-pdm.test', 'vias', 'Calle asignada para parcheo', 'La calle del colegio ya tiene cuadrilla asignada para parcheo.', 'ASIGNADO', 'MEDIUM', 'Nueva Lucía', 'Calle del colegio, Nueva Lucía', 8.7688, -75.9012, 10, 'Secretaría de Infraestructura'),
  ('MPM-2026-010051', 'luisa.prueba@monteria-pdm.test', 'alumbrado', 'Bombillo fundido en la esquina', 'El bombillo de la esquina de la tienda está fundido.', 'RECIBIDO', 'LOW', 'Nueva Lucía', 'Esquina de la tienda, Nueva Lucía', 8.7681, -75.9020, 2, 'Alumbrado público'),
  ('MPM-2026-010052', 'mario.prueba@monteria-pdm.test', 'parques', 'Parque recuperado', 'Cambiaron los juegos y cerraron el caso del parque.', 'RESUELTO', 'LOW', 'El Prado', 'Parque de El Prado', 8.7358, -75.8932, 45, 'Espacio público'),
  ('MPM-2026-010053', 'sofia.prueba@monteria-pdm.test', 'economia', 'Feria de emprendimiento sin punto fijo', 'Piden un punto fijo el sábado para la feria de comidas y oficios del barrio.', 'EN_REVISION', 'LOW', 'El Prado', 'Plazoleta de El Prado', 8.7351, -75.8940, 8, 'Secretaría de Desarrollo Económico'),
  ('MPM-2026-010054', 'andres.prueba@monteria-pdm.test', 'equipamientos', 'Biblioteca con techo dañado', 'La biblioteca del barrio tiene techo dañado. Ya están en la reparación.', 'EN_EJECUCION', 'MEDIUM', 'El Prado', 'Biblioteca de El Prado', 8.7362, -75.8928, 17, 'Secretaría de Infraestructura'),
  ('MPM-2026-010055', 'ana.prueba@monteria-pdm.test', 'basuras', 'Punto crítico de basura resuelto', 'Limpiaron el punto crítico de la entrada y el caso quedó cerrado.', 'RESUELTO', 'MEDIUM', 'Kennedy', 'Entrada de Kennedy', 8.7578, -75.9042, 22, 'Servigenerales de Montería'),
  ('MPM-2026-010056', 'carlos.prueba@monteria-pdm.test', 'basuras', 'Nueva acumulación en la misma esquina', 'En la misma esquina de Kennedy volvió a acumularse basura. La ruta ya pasó a revisión.', 'EN_EJECUCION', 'HIGH', 'Kennedy', 'Esquina principal de Kennedy', 8.7572, -75.9050, 4, 'Servigenerales de Montería'),
  ('MPM-2026-010057', 'luisa.prueba@monteria-pdm.test', 'agua', 'Alcantarilla tapada', 'Una alcantarilla de la calle 8 está tapada y el agua se devuelve.', 'RECIBIDO', 'HIGH', 'Kennedy', 'Calle 8 de Kennedy', 8.7584, -75.9038, 2, 'Acueducto y alcantarillado'),
  ('MPM-2026-010058', 'mario.prueba@monteria-pdm.test', 'vias', 'Hueco en la bajada', 'Hay un hueco en la bajada hacia el caño.', 'RECIBIDO', 'MEDIUM', 'Furatena', 'Bajada de Furatena', 8.7298, -75.8702, 5, 'Secretaría de Infraestructura'),
  ('MPM-2026-010059', 'sofia.prueba@monteria-pdm.test', 'alumbrado', 'Tramo oscuro en revisión', 'Un tramo de tres postes está en revisión porque se apagan juntos.', 'EN_REVISION', 'MEDIUM', 'Furatena', 'Tramo central de Furatena', 8.7291, -75.8710, 9, 'Alumbrado público'),
  ('MPM-2026-010060', 'andres.prueba@monteria-pdm.test', 'movilidad', 'Motos por el andén', 'En la entrada las motos se suben al andén porque la calzada es angosta.', 'RECIBIDO', 'LOW', 'Rancho Grande', 'Entrada de Rancho Grande', 8.7648, -75.8552, 6, 'Secretaría de Tránsito'),
  ('MPM-2026-010061', 'ana.prueba@monteria-pdm.test', 'parques', 'Cancha asignada para mantenimiento', 'La cancha ya tiene fecha de mantenimiento del piso.', 'ASIGNADO', 'LOW', 'Rancho Grande', 'Cancha de Rancho Grande', 8.7641, -75.8560, 13, 'Espacio público'),
  ('MPM-2026-010062', 'carlos.prueba@monteria-pdm.test', 'agua', 'Canal que se sale', 'El canal de la parte de atrás se sale cuando llueve. La obra de limpieza ya empezó.', 'EN_EJECUCION', 'HIGH', 'Sevilla', 'Canal de Sevilla', 8.7448, -75.9112, 7, 'Acueducto y alcantarillado'),
  ('MPM-2026-010063', 'luisa.prueba@monteria-pdm.test', 'basuras', 'Residuos en el canal', 'Al canal también le tiran bolsas y eso lo tapa más rápido.', 'RECIBIDO', 'MEDIUM', 'Sevilla', 'Canal de Sevilla', 8.7442, -75.9120, 3, 'Servigenerales de Montería'),
  ('MPM-2026-010064', 'mario.prueba@monteria-pdm.test', 'alumbrado', 'Avenida ya iluminada', 'Cambiaron las luminarias de la avenida. El caso está resuelto.', 'RESUELTO', 'LOW', 'Urbina', 'Avenida de Urbina', 8.7808, -75.8902, 33, 'Alumbrado público'),
  ('MPM-2026-010065', 'sofia.prueba@monteria-pdm.test', 'vias', 'Bache en la curva', 'Hay un bache en la curva de la salida.', 'RECIBIDO', 'MEDIUM', 'Urbina', 'Curva de salida de Urbina', 8.7801, -75.8910, 4, 'Secretaría de Infraestructura'),
  ('MPM-2026-010066', 'andres.prueba@monteria-pdm.test', 'seguridad', 'Ruido de un establecimiento', 'Un establecimiento deja el sonido alto entre semana.', 'RECIBIDO', 'LOW', 'Santa Fe', 'Calle comercial de Santa Fe', 8.7548, -75.8782, 2, 'Inspección de Policía'),
  ('MPM-2026-010067', 'ana.prueba@monteria-pdm.test', 'basuras', 'Basura validada en la plaza', 'Se validó la acumulación de basura en la plaza. Falta programar el retiro.', 'VALIDADO', 'MEDIUM', 'Santa Fe', 'Plaza de Santa Fe', 8.7541, -75.8790, 8, 'Servigenerales de Montería'),
  ('MPM-2026-010068', 'carlos.prueba@monteria-pdm.test', 'equipamientos', 'Polideportivo en obra', 'El techo del polideportivo se está cambiando. La obra va a la mitad.', 'EN_EJECUCION', 'MEDIUM', 'La Esperanza', 'Polideportivo de La Esperanza', 8.7888, -75.8602, 19, 'Secretaría de Infraestructura'),
  ('MPM-2026-010069', 'luisa.prueba@monteria-pdm.test', 'ideas', 'Huerta comunitaria', 'Proponen una huerta comunitaria en el lote de la junta de acción comunal.', 'RECIBIDO', 'LOW', 'La Esperanza', 'Lote de la junta, La Esperanza', 8.7881, -75.8610, 6, 'Oficina de participación'),
  ('MPM-2026-010070', 'mario.prueba@monteria-pdm.test', 'alumbrado', 'Poste de la bomba apagado', 'El poste que alumbra la bomba está apagado.', 'RECIBIDO', 'MEDIUM', 'El Dorado', 'Bomba de El Dorado', 8.7728, -75.9082, 3, 'Alumbrado público'),
  ('MPM-2026-010071', 'sofia.prueba@monteria-pdm.test', 'movilidad', 'Pare asignado en el cruce escolar', 'Ya asignaron la señal de pare del cruce escolar. Falta instalarla.', 'ASIGNADO', 'MEDIUM', 'El Dorado', 'Cruce escolar de El Dorado', 8.7721, -75.9090, 11, 'Secretaría de Tránsito');

INSERT INTO report.report (
  report_id, case_number, citizen_id, category_id, title, description, status, priority, source, public_visibility, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  s.case_number,
  c.citizen_id,
  cat.category_id,
  s.title,
  s.description,
  s.status,
  s.priority,
  'PRUEBA',
  TRUE,
  NOW() - (s.days_ago || ' days')::interval,
  NOW() - (s.days_ago || ' days')::interval
FROM seed_report s
JOIN citizen.citizen c ON c.email = s.email
JOIN catalog.category cat ON cat.slug = s.slug
ON CONFLICT (case_number) DO NOTHING;

INSERT INTO geo.report_location (
  location_id, report_id, latitude, longitude, address, neighborhood_id, locality, reference
)
SELECT
  gen_random_uuid(),
  r.report_id,
  s.lat,
  s.lng,
  s.address,
  n.neighborhood_id,
  'Montería',
  s.barrio
FROM seed_report s
JOIN report.report r ON r.case_number = s.case_number
JOIN catalog.neighborhood n ON n.name = s.barrio
WHERE NOT EXISTS (
  SELECT 1 FROM geo.report_location existing WHERE existing.report_id = r.report_id
);

INSERT INTO case_mgmt.case_management (
  case_id, report_id, current_status, responsible_entity, responsible_area, assigned_at, resolved_at
)
SELECT
  gen_random_uuid(),
  r.report_id,
  r.status,
  s.entity,
  'Atención ciudadana',
  CASE WHEN r.status IN ('ASIGNADO', 'EN_EJECUCION', 'RESUELTO') THEN r.created_at + INTERVAL '1 day' END,
  CASE WHEN r.status = 'RESUELTO' THEN r.created_at + INTERVAL '10 days' END
FROM seed_report s
JOIN report.report r ON r.case_number = s.case_number
WHERE NOT EXISTS (
  SELECT 1 FROM case_mgmt.case_management existing WHERE existing.report_id = r.report_id
);

INSERT INTO case_mgmt.case_history (history_id, case_id, previous_status, new_status, description, changed_by, created_at)
SELECT
  gen_random_uuid(),
  cm.case_id,
  NULL,
  cm.current_status,
  'Caso de prueba cargado para consulta ciudadana',
  'sistema',
  r.created_at
FROM seed_report s
JOIN report.report r ON r.case_number = s.case_number
JOIN case_mgmt.case_management cm ON cm.report_id = r.report_id
WHERE NOT EXISTS (
  SELECT 1 FROM case_mgmt.case_history existing WHERE existing.case_id = cm.case_id
);

INSERT INTO participation.wall_post (
  post_id, citizen_id, kind, title, body, category_slug, barrio, ref_type, ref_id, reference, created_at
)
SELECT
  gen_random_uuid(),
  r.citizen_id,
  'REPORTE',
  LEFT(r.title, 180),
  r.description,
  cat.slug,
  n.name,
  'REPORT',
  r.report_id,
  r.case_number,
  r.created_at
FROM seed_report s
JOIN report.report r ON r.case_number = s.case_number
JOIN catalog.category cat ON cat.category_id = r.category_id
JOIN geo.report_location l ON l.report_id = r.report_id
JOIN catalog.neighborhood n ON n.neighborhood_id = l.neighborhood_id
WHERE NOT EXISTS (
  SELECT 1 FROM participation.wall_post existing
  WHERE existing.kind = 'REPORTE' AND existing.ref_id = r.report_id
);

INSERT INTO project.project (
  project_id, name, description, status, neighborhood_id, progress, start_date, estimated_end_date
)
SELECT
  gen_random_uuid(),
  v.name,
  v.description,
  v.status,
  n.neighborhood_id,
  v.progress,
  v.start_date,
  v.end_date
FROM (VALUES
  ('Puntos limpios en Vallejo', 'Instalan dos puntos de recolección y refuerzan la ruta de los martes y viernes.', 'EN_EJECUCION', 'Vallejo', 45, DATE '2026-08-01', DATE '2026-12-15'),
  ('Parcheo de la vía principal de La Granja', 'Tapan la hilera de huecos de la vía principal y reponen dos tapas de alcantarilla.', 'EN_EJECUCION', 'La Granja', 62, DATE '2026-07-10', DATE '2026-11-30'),
  ('Parque de Brisas del Sinú', 'Cambian juegos, podan y mejoran el drenaje de la parte baja.', 'EN_EJECUCION', 'Brisas del Sinú', 38, DATE '2026-09-01', DATE '2027-02-28'),
  ('Alumbrado LED en Mocarí', 'Reemplazan luminarias de las cuadras que quedan a oscuras.', 'EN_EJECUCION', 'Mocarí', 80, DATE '2026-06-01', DATE '2026-11-15'),
  ('Canal de aguas lluvias en Cantaclaro', 'Limpian y amplían el caño para que la calle principal no se inunde.', 'PLANIFICADO', 'Cantaclaro', 15, DATE '2026-11-01', DATE '2027-04-30'),
  ('Señalización escolar en El Dorado', 'Instalan pare y cebra en el cruce del colegio.', 'ASIGNADO', 'El Dorado', 25, DATE '2026-10-01', DATE '2026-12-20')
) AS v(name, description, status, barrio, progress, start_date, end_date)
JOIN catalog.neighborhood n ON n.name = v.barrio
WHERE NOT EXISTS (
  SELECT 1 FROM project.project existing WHERE existing.name = v.name
);
