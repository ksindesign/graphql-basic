import React, { useState } from 'react';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      ... on UsersSuccessfulResult {
        users {
          id
          name
          age
          nationality
          username
        }
      }
      ... on UsersErrorResult {
        message
      }
    }
  }
`;

const GET_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState('');

  // Create User States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState('');

  // Helper function to format nationality for display
  const formatNationality = (nat) => {
    return nat === 'HONGKONG' ? 'HONG KONG' : nat;
  };

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const { data: moviesData } = useQuery(GET_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  // Functions
  const handleChange = (event) => {
    setMovieSearched(event.target.value);
  };
  const handleSearch = () => {
    fetchMovie({ variables: { name: movieSearched } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section>
      <div className='createUser'>
        <input
          type='text'
          placeholder='Name...'
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type='text'
          placeholder='Username...'
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type='number'
          placeholder='Age...'
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <select
          name='nationality'
          id='nationality'
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        >
          <option value='AMERICAN'>AMERICAN</option>
          <option value='CHINA'>CHINA</option>
          <option value='BRAZIL'>BRAZIL</option>
          <option value='HONGKONG'>HONG KONG</option>
          <option value='GERMANY'>GERMANY</option>
          <option value='INDIA'>INDIA</option>
          <option value='CHILE'>CHILE</option>
        </select>
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>
      <div>
        {data && data.users.users &&
          data.users.users.map((user) => {
            return (
              <ul key={user.id}>
                <li>ID: {user.id}</li>
                <li>Name: {user.name}</li>
                <li>Age: {user.age}</li>
                <li>Nationality: {formatNationality(user.nationality)}</li>
                <li>Username: {user.username}</li>
                <button
                  onClick={() => {
                    deleteUser({
                      variables: {
                        input: { id: user.id },
                      },
                    });
                    refetch();
                  }}
                >
                  delete
                </button>
              </ul>
            );
          })}
        {data && data.users.message && (
          <div>Error: {data.users.message}</div>
        )}
      </div>
      <div hidden>
        {moviesData &&
          moviesData.movies.map((movie) => {
            return (
              <ul>
                <li>Name: {movie.name}</li>
                <li>Year of Publication: {movie.yearOfPublication}</li>
                <li>Is in Theaters: {movie.isInTheaters ? 'Yes' : 'No'}</li>
              </ul>
            );
          })}
      </div>
      <div>
        <input
          type='text'
          placeholder='Search for a movie'
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search Movies</button>
        <div>
          {' '}
          {movieSearchedData && (
            <ul>
              <li>MovieName: {movieSearchedData.movie.name}</li>
              <li>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </li>
              <li>
                Is in Theaters:
                {movieSearchedData.movie.isInTheaters ? 'Yes' : 'No'}
              </li>
            </ul>
          )}
          {movieError && <p> There was an error fetching the data</p>}
        </div>
      </div>
    </section>
  );
}
export default DisplayData;
