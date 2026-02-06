const Console = require("./ConsoleUtils");

class TournamentXController {

    // Offizielle TournamentX‑Turniere (Client‑Format)
    static tournaments = [
        {
            id: 1,
            type: 1,
            isEnabled: true,
            minVersion: "0.64",

            startTime: new Date(), // sofort sichtbar
            endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),

            nameKey: "BD 1v1",
            descriptionKey: "Practice your skills in the Stumble Base TournamentX! mode!",

            listItemBackgroundImage: "SharkTanic_Background_Image_Tournaments_Card",
            detailsPanelBackgroundImage: "SharkTanic_Background_Image_Tournaments",

            prizeBannerColour: "#005577",
            headerColour: "#007799",
            mapListGradientColourTop: "#004466",
            mapListGradientColourBottom: "#002233",

            listPriority: 1,

            minPlayers: 2,
            maxPlayers: 2,
            maxRounds: 1,
            minMatchmakingSeconds: 2,

            entryCurrencyType: "gems",
            entryCurrencyCost: 0,

            areEmotesRestricted: false,
            prohibitedEmotes: [8, 13, 55, 122, 123, 124],

            detailsPanelBorderColourTop: "#004080",
            detailsPanelBorderColourBottom: "#002040"
        }
    ];

    // Gibt alle aktiven TournamentX‑Turniere zurück
    getActive(req, res) {
        try {
            const version = req.headers["x-version"] || "0.64";

            const active = TournamentXController.tournaments.filter(t =>
                t.isEnabled &&
                parseFloat(version) >= parseFloat(t.minVersion) &&
                Date.now() >= new Date(t.startTime).getTime() &&
                Date.now() <= new Date(t.endTime).getTime()
            );

            return res.json({
                success: true,
                tournaments: active
            });

        } catch (err) {
            Console.error("TournamentX", err.message);
            return res.status(500).json({ success: false });
        }
    }

    // Spieler tritt einem TournamentX‑Turnier bei
    join(req, res) {
        try {
            const { tournamentId } = req.params;
            const { userId } = req.body;

            if (!userId) {
                return res.json({ success: false, error: "userId fehlt" });
            }

            const tournament = TournamentXController.tournaments.find(t => t.id == tournamentId);

            if (!tournament) {
                return res.json({ success: false, error: "Turnier nicht gefunden" });
            }

            return res.json({
                success: true,
                message: "Beitritt erfolgreich",
                tournamentId: tournamentId
            });

        } catch (err) {
            Console.error("TournamentX", err.message);
            return res.status(500).json({ success: false });
        }
    }

    // Spieler verlässt ein TournamentX‑Turnier
    leave(req, res) {
        try {
            const { tournamentId } = req.params;

            const tournament = TournamentXController.tournaments.find(t => t.id == tournamentId);

            if (!tournament) {
                return res.json({ success: false, error: "Turnier nicht gefunden" });
            }

            return res.json({
                success: true,
                message: "Verlassen erfolgreich"
            });

        } catch (err) {
            Console.error("TournamentX", err.message);
            return res.status(500).json({ success: false });
        }
    }

    // Turnier wird beendet
    finish(req, res) {
        try {
            const { tournamentId } = req.params;

            const tournament = TournamentXController.tournaments.find(t => t.id == tournamentId);

            if (!tournament) {
                return res.json({ success: false, error: "Turnier nicht gefunden" });
            }

            tournament.isEnabled = false;

            return res.json({
                success: true,
                message: "Turnier beendet"
            });

        } catch (err) {
            Console.error("TournamentX", err.message);
            return res.status(500).json({ success: false });
        }
    }
}

module.exports = new TournamentXController();
