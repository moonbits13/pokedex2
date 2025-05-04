import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Navbar, Nav, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const BattleHistory = () => {
  const [battleHistory, setBattleHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/battleHistory');
        setBattleHistory(data);
      } catch (err) {
        console.error('Error fetching battle history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const deleteBattle = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/battleHistory/${id}`);
      setBattleHistory(battleHistory.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error deleting battle:', err);
    }
  };

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

      <Container className="mt-4" style={{ fontFamily: 'Comic Sans MS', backgroundColor: '#f5e2e2', borderRadius: '10px', padding: '20px' }}>
        <h2 className="text-center" style={{ color: '#ff0080' }}>Battle History</h2>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : battleHistory.length === 0 ? (
          <p className="text-center">No battles recorded yet.</p>
        ) : (
          battleHistory.map((battle, idx) => (
            <Card key={battle.id} className="mb-4">
              <Card.Body>
                <Card.Title>Battle #{idx + 1} - {new Date(battle.date).toLocaleString()}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{battle.final}</Card.Subtitle>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Your Pokémon</th>
                      <th>Opponent</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {battle.rounds.map((round, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{round.pokemon}</td>
                        <td>{round.opponent}</td>
                        <td>{round.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p><strong>Total Wins:</strong> {battle.totalWins} | <strong>Total Losses:</strong> {battle.totalLosses}</p>
                <Button variant="danger" onClick={() => deleteBattle(battle.id)}><FaTrashAlt /> Delete</Button>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
};

export default BattleHistory;
