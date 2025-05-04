import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/team');
        setTeam(data);
      } catch (err) {
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const deletePokemon = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/team/${id}`);
      setTeam(team.filter((pokemon) => pokemon.id !== id));
    } catch (err) {
      console.error('Error deleting Pokémon from the team:', err);
    }
  };

  // Check if the team has less than 6 Pokémon
  const isTeamFull = team.length >= 6;

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-warning">Pokédex</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
            <Nav.Link as={Link} to="/battle" disabled={isTeamFull} className="text-light">
              Battle
            </Nav.Link>
            <Nav.Link as={Link} to="/history" className="text-light">History</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Team Page Content */}
      <Container className="mt-4" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        <h2 className="text-center" style={{ color: '#ff0080' }}>Your Team</h2>

        {loading ? (
          <div className="text-center">Loading your team...</div>
        ) : team.length === 0 ? (
          <p className="text-center">You have no Pokémon in your team yet.</p>
        ) : (
          <>
            <Row>
              {team.map((pokemon) => (
                <Col key={pokemon.id} md={4}>
                  <Card className="mb-4 shadow-lg border border-3 border-dark" style={{ backgroundColor: '#ffefc3' }}>
                    <Card.Body>
                      <Card.Img
                        variant="top"
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        style={{ width: '150px', margin: 'auto', borderRadius: '10px', transition: 'transform 0.2s' }}
                        className="mb-3 hover-zoom"
                      />
                      <Card.Title style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                        {pokemon.name ? pokemon.name.toUpperCase() : 'Unknown Pokémon'}
                      </Card.Title>

                      <Card.Text>
                        <strong>HP:</strong> {pokemon.hp}<br />
                        <strong>Attack:</strong> {pokemon.attack}<br />
                        <strong>Defense:</strong> {pokemon.defense}<br />
                        <strong>Special Attack:</strong> {pokemon.specialAttack}<br />
                        <strong>Special Defense:</strong> {pokemon.specialDefense}<br />
                        <strong>Speed:</strong> {pokemon.speed}<br />
                      </Card.Text>

                      <Button variant="danger" onClick={() => deletePokemon(pokemon.id)}>
                        <FaTrashAlt /> Remove from Team
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Start Battle Link */}
            <div className="text-center">
           
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default TeamPage;
