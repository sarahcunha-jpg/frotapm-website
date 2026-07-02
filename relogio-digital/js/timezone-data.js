// Lista de fusos horários disponíveis
const timezonesData = [
    { timezone: 'UTC', cidade: 'Hora Universal', pais: 'Mundo', offset: 0, flag: '🌐' },
    { timezone: 'America/New_York', cidade: 'Nova York', pais: 'Estados Unidos', offset: -5, flag: '🇺🇸' },
    { timezone: 'America/Chicago', cidade: 'Chicago', pais: 'Estados Unidos', offset: -6, flag: '🇺🇸' },
    { timezone: 'America/Denver', cidade: 'Denver', pais: 'Estados Unidos', offset: -7, flag: '🇺🇸' },
    { timezone: 'America/Los_Angeles', cidade: 'Los Angeles', pais: 'Estados Unidos', offset: -8, flag: '🇺🇸' },
    { timezone: 'America/Anchorage', cidade: 'Anchorage', pais: 'Estados Unidos', offset: -9, flag: '🇺🇸' },
    { timezone: 'Pacific/Honolulu', cidade: 'Honolulu', pais: 'Estados Unidos', offset: -10, flag: '🇺🇸' },
    { timezone: 'Atlantic/Azores', cidade: 'Açores', pais: 'Portugal', offset: -1, flag: '🇵🇹' },
    { timezone: 'Europe/London', cidade: 'Londres', pais: 'Reino Unido', offset: 0, flag: '🇬🆾' },
    { timezone: 'Europe/Paris', cidade: 'Paris', pais: 'França', offset: 1, flag: '🇫🇷' },
    { timezone: 'Europe/Berlin', cidade: 'Berlim', pais: 'Alemanha', offset: 1, flag: '🇩🇪' },
    { timezone: 'Europe/Moscow', cidade: 'Moscou', pais: 'Rússia', offset: 3, flag: '🇷🇺' },
    { timezone: 'Asia/Dubai', cidade: 'Dubai', pais: 'Emirados Árabes', offset: 4, flag: '🇦🇪' },
    { timezone: 'Asia/Kolkata', cidade: 'Nova Délhi', pais: 'Índia', offset: 5.5, flag: '🇮🇳' },
    { timezone: 'Asia/Bangkok', cidade: 'Bangcoc', pais: 'Tailândia', offset: 7, flag: '🇹🇭' },
    { timezone: 'Asia/Shanghai', cidade: 'Xangai', pais: 'China', offset: 8, flag: '🇨🇳' },
    { timezone: 'Asia/Hong_Kong', cidade: 'Hong Kong', pais: 'China', offset: 8, flag: '🇨🇳' },
    { timezone: 'Asia/Tokyo', cidade: 'Tóquio', pais: 'Japão', offset: 9, flag: '🇯🇵' },
    { timezone: 'Australia/Sydney', cidade: 'Sydney', pais: 'Austrália', offset: 10, flag: '🇦🇺' },
    { timezone: 'Pacific/Auckland', cidade: 'Auckland', pais: 'Nova Zelândia', offset: 12, flag: '🇳🇿' },
    { timezone: 'America/Sao_Paulo', cidade: 'São Paulo', pais: 'Brasil', offset: -3, flag: '🇧🇷' },
    { timezone: 'America/Manaus', cidade: 'Manaus', pais: 'Brasil', offset: -4, flag: '🇧🇷' },
    { timezone: 'America/Buenos_Aires', cidade: 'Buenos Aires', pais: 'Argentina', offset: -3, flag: '🇦🇷' },
    { timezone: 'America/Lima', cidade: 'Lima', pais: 'Peru', offset: -5, flag: '🇵🇪' },
    { timezone: 'America/Bogota', cidade: 'Bogotá', pais: 'Colômbia', offset: -5, flag: '🇨🇴' },
    { timezone: 'America/Mexico_City', cidade: 'Cidade do México', pais: 'México', offset: -6, flag: '🇲🇽' },
    { timezone: 'Africa/Cairo', cidade: 'Cairo', pais: 'Egito', offset: 2, flag: '🇪🇬' },
    { timezone: 'Africa/Johannesburg', cidade: 'Joanesburgo', pais: 'África do Sul', offset: 2, flag: '🇿🇦' },
    { timezone: 'Asia/Singapore', cidade: 'Cingapura', pais: 'Cingapura', offset: 8, flag: '🇸🇬' },
    { timezone: 'Asia/Seoul', cidade: 'Seul', pais: 'Coreia do Sul', offset: 9, flag: '🇰🇷' }
];

// Fusos horários padrão para renderizar
const defaultTimezones = [
    'America/Sao_Paulo',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
];
