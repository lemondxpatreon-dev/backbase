// TournamentXController.js
const TournamentManager = require("./TournamentManager");
const Console = require("./ConsoleUtils");

class TournamentXController {

  // Gibt Turniere im Format zurück, das der Client erwartet
  getActive(req, res) {
    try {
      const tournaments = TournamentManager.getActiveTournaments();

      const formatted = tournaments.map(t => ({
        tournamentId: t.id,
        name: t.name,
        style: t.style,
        map: t.map,
        emojis: t.emojis,
        maxPlayers: t.maxPlayers,
        rounds: t.rounds,
        status: t.status,
        players: t.players.length,
        startTime: t.startTime,
        registrationTime: t.registrationTime
      }));

      return res.json({
        success: true,
        tournaments: formatted
      });

    } catch (err) {
      Console.error("TournamentX", err.message);
      return res.status(500).json({ success: false });
    }
  }

  // Spieler tritt einem Turnier bei
  join(req, res) {
    try {
      const { tournamentId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.json({ success: false, error: "userId fehlt" });
      }

      const result = TournamentManager.registerPlayer(tournamentId, userId);

      if (result.error) {
        return res.json({ success: false, error: result.error });
      }

      return res.json({
        success: true,
        tournament: result.tournament
      });

    } catch (err) {
      Console.error("TournamentX", err.message);
      return res.status(500).json({ success: false });
    }
  }

  // Spieler verlässt ein Turnier
  leave(req, res) {
    try {
      const { tournamentId } = req.params;
      const { userId } = req.body;

      const tournament = TournamentManager.getTournament(tournamentId);
      if (!tournament) {
        return res.json({ success: false, error: "Torneio não encontrado" });
      }

      tournament.players = tournament.players.filter(p => p.userId !== userId);
      TournamentManager.saveData();

      return res.json({ success: true });

    } catch (err) {
      Console.error("TournamentX", err.message);
      return res.status(500).json({ success: false });
    }
  }

  // Turnier wird beendet
  finish(req, res) {
    try {
      const { tournamentId } = req.params;

      const tournament = TournamentManager.getTournament(tournamentId);
      if (!tournament) {
        return res.json({ success: false, error: "Torneio não encontrado" });
      }

      tournament.status = "finished";
      tournament.finishedAt = Date.now();
      TournamentManager.saveData();

      return res.json({ success: true });

    } catch (err) {
      Console.error("TournamentX", err.message);
      return res.status(500).json({ success: false });
    }
  }
}

module.exports = new TournamentXController();
