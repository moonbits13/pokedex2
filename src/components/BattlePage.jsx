import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Navbar, Nav, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BattlePage = () => {
  const [team, setTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [battling, setBattling] = useState(false);
  const [roundResults, setRoundResults] = useState([]);
  const [finalResult, setFinalResult] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const { data: userTeam } = await axios.get('http://localhost:3001/team');
        setTeam(userTeam);

        const listRes = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemons = listRes.data.results;

        const picks = [];
        while (picks.length < userTeam.length) {
          const rand = pokemons[Math.floor(Math.random() * pokemons.length)];
          if (!picks.find(p => p.name === rand.name)) picks.push(rand);
        }

        const oppDetails = await Promise.all(
          picks.map(async p => {
            const res = await axios.get(p.url);
            const stats = {};
            res.data.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });
            return {
              id: res.data.id,
              name: res.data.name,
              sprite: res.data.sprites.front_default,
              hp: stats.hp,
              attack: stats.attack,
              speed: stats.speed
            };
          })
        );
        setOpponentTeam(oppDetails);
      } catch (err) {
        console.error('Error loading teams:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  const battlePair = (p1, p2) => {
    const rounds = [];
    const stats = ['hp', 'attack', 'speed'];
    let p1Wins = 0;
    let p2Wins = 0;

    stats.forEach(stat => {
      const val1 = p1[stat];
      const val2 = p2[stat];
      const winner = val1 > val2 ? p1.name : val2 > val1 ? p2.name : 'Tie';
      if (winner === p1.name) p1Wins++; else if (winner === p2.name) p2Wins++;
      rounds.push({ stat, p1: val1, p2: val2, winner });
    });
    const result = p1Wins > p2Wins ? 'Win' : p2Wins > p1Wins ? 'Lose' : 'Draw';
    return { rounds, result };
  };

  const startBattle = async () => {
    if (!team.length) return alert('Your team is empty! Add Pokémon first.');
    setBattling(true);

    const allRoundResults = [];
    let totalWins = 0;
    let totalLosses = 0;
    let totalSpeedDiff = 0;

    team.forEach((p, idx) => {
      const opp = opponentTeam[idx] || p;
      const { rounds, result } = battlePair(p, opp);
      allRoundResults.push({ pokemon: p.name, opponent: opp.name, result });
      if (result === 'Win') totalWins++;
      else if (result === 'Lose') totalLosses++;
      totalSpeedDiff += (p.speed - (opp.speed || 0));
    });

    let final = '';
    if (totalWins > totalLosses) final = 'You Win!';
    else if (totalLosses > totalWins) final = 'You Lose!';
    else {
      if (totalSpeedDiff > 0) final = 'You Win!';
      else if (totalSpeedDiff < 0) final = 'You Lose!';
      else final = Math.random() < 0.5 ? 'You Win!' : 'You Lose!';
    }

    setTimeout(async () => {
      setRoundResults(allRoundResults);
      setFinalResult(final);
      setBattling(false);
      try {
        await axios.post('http://localhost:3001/battleHistory', {
          date: new Date().toISOString(),
          final,
          rounds: allRoundResults,
          totalWins,
          totalLosses
        });
      } catch (err) {
        console.error('Error saving battleHistory:', err);
      }
    }, 1000);
  };

  const renderCards = (list, bg) => (
    list.map(p => (
      <Card key={p.id} className="m-2" style={{ width: '15rem', backgroundColor: bg }}>
        <Card.Img variant="top" src={p.sprite} style={{ imageRendering: 'pixelated' }} />
        <Card.Body>
          <Card.Title className="text-capitalize">{p.name}</Card.Title>
          <Card.Text>HP: {p.hp}</Card.Text>
          <Card.Text>Attack: {p.attack}</Card.Text>
          <Card.Text>Speed: {p.speed}</Card.Text>
        </Card.Body>
      </Card>
    ))
  );

  const renderRounds = () => (
    roundResults.map((res, idx) => (
      <Card key={idx} className="mb-3">
        <Card.Body>
          <Card.Text className="fs-5">{res.pokemon} vs {res.opponent} - <strong>{res.result}</strong></Card.Text>
        </Card.Body>
      </Card>
    ))
  );

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Pokédex</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/team">Team</Nav.Link>
            <Nav.Link as={Link} to="/battle">Battle</Nav.Link>
            <Nav.Link as={Link} to="/history">History</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="text-center mt-4">
        <h1>Battle Arena</h1>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <div className="d-flex justify-content-around flex-wrap my-4">
              <div>
                <h3>Your Team</h3>
                <div className="d-flex flex-wrap justify-content-center">
                  {renderCards(team, '#ffefc3')}
                </div>
              </div>
              <div>
                <h3>Opponent Team</h3>
                <div className="d-flex flex-wrap justify-content-center">
                  {renderCards(opponentTeam, '#f8d7da')}
                </div>
              </div>
            </div>
            <Button variant="primary" size="lg" onClick={startBattle} disabled={battling} className="px-5 py-2 fs-5">
              {battling ? <Spinner animation="border" size="sm" /> : 'Start Battle'}
            </Button>
            {finalResult && <h2 className="mt-4">{finalResult}</h2>}
            {roundResults.length > 0 && <div className="mt-4 text-start">{renderRounds()}</div>}
          </>
        )}
      </Container>
    </>
  );
};

export default BattlePage;
