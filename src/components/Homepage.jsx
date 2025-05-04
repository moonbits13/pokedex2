import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, FormControl, Button, Card, Badge, Spinner, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Logo from '../assets/pokedex.png';

const Homepage = () => {
  const [query, setQuery] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  const [addedToTeam, setAddedToTeam] = useState(false); // Track if Pokémon is added

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAddedToTeam(false); // Reset addedToTeam state when starting a new search

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) throw new Error('Not found');

      const data = await response.json();
      setPokemonData(data);
      setQuery('');
    } catch (err) {
      setError('Oops! Pokémon not found. Try another name.');
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  const addToTeam = async (pokemon) => {
    if (team.length >= 6) {
      alert('Your team is full! Release a Pokémon first.');
      return;
    }

    const stats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name.toUpperCase()] = stat.base_stat;
      return acc;
    }, {});

    const newPokemon = {
      id: uuidv4(),
      name: pokemon.name,
      sprite: pokemon.sprites?.front_default,
      hp: stats['HP'] || 0,
      attack: stats['ATTACK'] || 0,
      defense: stats['DEFENSE'] || 0,
      specialAttack: stats['SPECIAL-ATTACK'] || 0,
      specialDefense: stats['SPECIAL-DEFENSE'] || 0,
      speed: stats['SPEED'] || 0,
    };

    try {
      setTeam([...team, newPokemon]);
      setAddedToTeam(true); // Set addedToTeam to true when Pokémon is added
      await axios.post('http://localhost:3001/team', newPokemon);
      alert(`${pokemon.name} added to your team!`);
    } catch (error) {
      console.error('Failed to add Pokémon to the team:', error);
      alert('Failed to add Pokémon to the team');
    }
  };

  return (
    <>
      {/* Updated Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-warning">
           
            <span className="ms-2">Pokédex</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-light">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/team" className="text-light">
                Team
              </Nav.Link>
              <Nav.Link as={Link} to="/battle" className="text-light">
                Battle
              </Nav.Link>
              <Nav.Link as={Link} to="/history" className="text-light">
                History
              </Nav.Link>
            </Nav>
            <Link to="/pokedex" className="btn btn-danger">Open Pokédex</Link>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Homepage Content */}
      <Container className="text-center mt-4" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        <img src={Logo} alt="Pokedex Logo" style={{ width: '300px' }} className="mb-4" />

        <Form className="d-flex justify-content-center" onSubmit={handleSearch}>
          <FormControl
            type="text"
            placeholder="Search Pokémon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="me-2"
            style={{ maxWidth: '300px', borderRadius: '10px' }}
          />
          <Button variant="warning" type="submit">
            {loading ? <Spinner animation="border" size="sm" /> : 'Fetch'}
          </Button>
        </Form>

        {error && <p className="text-danger mt-3">{error}</p>}

        {pokemonData && !addedToTeam && ( // Only show the card if Pokémon is not added
          <Card className="mt-4 mx-auto shadow-lg border border-3 border-dark" style={{ maxWidth: '400px', backgroundColor: '#ffefc3' }}>
            <Card.Body>
              <Card.Img
                variant="top"
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                style={{ width: '150px', margin: 'auto', borderRadius: '10px', transition: 'transform 0.2s' }}
                className="mb-3 hover-zoom"
              />
              <Card.Title style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                {pokemonData.name.toUpperCase()}
              </Card.Title>

              <Card.Text>
                <strong>Type:</strong>{" "}
                {pokemonData.types.map((t, index) => (
                  <Badge key={index} bg="primary" className="me-1">{t.type.name}</Badge>
                ))}<br />
                <strong>Weight:</strong> {pokemonData.weight}<br />
                <strong>HP:</strong> {pokemonData.stats.find(stat => stat.stat.name === 'hp')?.base_stat}<br />
                <strong>Attack:</strong> {pokemonData.stats.find(stat => stat.stat.name === 'attack')?.base_stat}<br />
                <strong>Defense:</strong> {pokemonData.stats.find(stat => stat.stat.name === 'defense')?.base_stat}
              </Card.Text>

              <hr />
              <h5>Stats</h5>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {pokemonData.stats.map((stat) => (
                  <li key={stat.stat.name}>
                    <strong>{stat.stat.name.toUpperCase()}</strong>: {stat.base_stat}
                  </li>
                ))}
              </ul>

              <Button variant="success" className="mt-3" onClick={() => addToTeam(pokemonData)}>
                Add to Team
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Homepage;
