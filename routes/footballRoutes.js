const express = require('express');
const { getTeams, getTeamStatistics } = require('../services/footballApiService');
const router = express.Router();

// Ruta para obtener información de equipos
router.get('/teams/:leagueId/:season', async (req, res) => {
  const { leagueId, season } = req.params;
  try {
    const teamsData = await getTeams(leagueId, season);
    res.json(teamsData);
  } catch (error) {
    res.status(500).send('Error obteniendo equipos');
  }
});

// Ruta para obtener estadísticas de un equipo
router.get('/teams/:teamId/statistics/:leagueId/:season', async (req, res) => {
  const { teamId, leagueId, season } = req.params;
  try {
    const statsData = await getTeamStatistics(teamId, season, leagueId);
    res.json(statsData);
  } catch (error) {
    res.status(500).send('Error obteniendo estadísticas del equipo');
  }
});

module.exports = router;
