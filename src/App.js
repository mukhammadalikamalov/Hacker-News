import { Box, Button, Container, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HackerNews = () => {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    try {
      // Perform login action
      // For simplicity, I'm just redirecting to the login page
      window.location.href = 'https://news.ycombinator.com/login?goto=news%3Fp%3D2';
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  };

  const fetchData = async (resetPage = false) => {
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${query}&page=${resetPage ? 0 : page}`);
      if (resetPage) {
        setData(response.data);
        setPage(1);
      } else {
        setData(prevData => ({
          ...response.data,
          hits: [...(prevData ? prevData.hits : []), ...response.data.hits]
        }));
        setPage(prevPage => prevPage + 1);
      }
      setHasMore(response.data.hits.length > 0);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <Container style={{ marginTop: '2rem', backgroundColor: '#f6f6ef', padding: '2rem', borderRadius: '8px' }}>
      <Box display="flex" alignItems="center" marginBottom="1rem">
        <TextField
          fullWidth
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Hacker News"
          style={{ backgroundColor: '#FFFFFF', fontFamily: 'Verdana, Geneva, sans-serif' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchData(true)}
          style={{ marginLeft: '1rem' }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={login}
          style={{ marginLeft: '1rem' }}
        >
          Login
          <Typography variant="body2" component="span" style={{ marginLeft: '0.5rem' }}>
            (Login to access more features)
          </Typography>
        </Button>
      </Box>
      {data ? (
        <>
          <List>
            {data.hits.map((item, index) => (
              <ListItem key={item.objectID} component="a" href={item.url} button>
                <ListItemText
                  primary={
                    <Typography variant="body1" component="span">
                      {`${index + 1}. ${item.title}`}
                    </Typography>
                  }
                  secondary={item.author}
                />
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => fetchData()}
              style={{ marginTop: '1rem' }}
            >
              Load More
            </Button>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default HackerNews;
