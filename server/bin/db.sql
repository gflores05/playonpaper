CREATE TABLE Game (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULTS,
  modified TIMESTAMP,
  name VARCHAR(50),
  slug VARCHAR(50),
  status GameStatus
)

CREATE TABLE User (
  username VARCHAR(50),
  email VARCHAR(50)
)

CREATE TABLE Player (
  userId BIGINT,
  name VARCHAR(50)
)

CREATE TABLE Play (
  gameId BIGINT,
  status PlayStatus,
  state JSONB,
  winner BIGINT
),

CREATE TABLE PlayerState (
  playerId BIGINT,
  playId BIGINT,
  state JSONB,
  status PlayerStatus
)
