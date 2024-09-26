const axios = require('axios');

// Base URL de la API de fútbol
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

// Headers de autenticación
const headers = {
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
  "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Tomamos la clave de la API desde el archivo .env
};

// Función para obtener información de equipos
exports.getTeams = async (leagueId, season) => {
  try {
    const response = await axios.get(`${BASE_URL}/teams`, {
      headers: headers,
      params: {
        league: leagueId, // El ID de la liga que queremos consultar
        season: season // La temporada que queremos consultar
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo datos de equipos:', error);
    throw error;
  }
};

// Función para obtener estadísticas de un equipo
exports.getTeamStatistics = async (teamId, season, leagueId) => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/statistics`, {
      headers: headers,
      params: {
        team: teamId, // El ID del equipo que queremos consultar
        season: season, // La temporada que queremos consultar
        league: leagueId // La liga para filtrar
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas del equipo:', error);
    throw error;
  }
};
