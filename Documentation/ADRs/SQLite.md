# ADR: Use SQLite for Persistent Storage

Date: 23/05/2024

## Context
We are developing a web-based game called Broken Picture Phone, which involves multiple players connecting to a server to alternately draw pictures and describe drawings. To facilitate this, we need a reliable method to store user details and log game events. The storage solution should be easy to set up and maintain, and it should integrate well with our existing technology stack, which includes Node.js for the server-side logic.

## Decision
We have decided to use SQLite as the persistent storage solution for the following reasons:

*Simplicity: SQLite is a self-contained, serverless database engine. It does not require a separate server process, making it straightforward to set up and manage.
*Integration: SQLite integrates easily with Node.js through various libraries, such as sqlite3 or better-sqlite3, allowing us to efficiently handle database operations in our existing codebase.
*Portability: The entire database is stored in a single file, which simplifies deployment and backup processes.
*Performance: For a game with a moderate number of players and game events, SQLite provides adequate performance, particularly for read-heavy operations.
*ACID Compliance: SQLite is ACID-compliant, ensuring that our data remains consistent and durable in the event of unexpected failures.
*Consequences
*Positive Consequences
*Ease of Use: The simplicity of SQLite reduces the complexity of our development and deployment processes.
*Quick Setup: Since SQLite does not require a dedicated server, we can set up and start using the database quickly.
*Cost-Effective: SQLite is free to use and does not incur additional operational costs.
*Reduced Overhead: With no separate server to manage, the overhead of database administration is minimized.
*Negative Consequences
*Scalability: SQLite is not designed for high-concurrency, large-scale applications. If our game grows significantly in popularity, we may need to consider migrating to a more robust database system.
*Limited Features: SQLite lacks some advanced features found in other database systems, such as full-text search, advanced indexing, and horizontal scalability.
*Alternatives Considered
*MySQL/PostgreSQL: These are more robust and scalable relational database systems. However, they require more complex setup and administration, which may be overkill for our initial needs.
*NoSQL Databases (e.g., MongoDB): These databases offer flexibility and scalability, but our data model fits well within a relational paradigm, making a SQL-based solution more appropriate.
*In-Memory Databases (e.g., Redis): These are extremely fast but not suitable for persistent storage due to their volatility.

## Implementation
We use the sqlite3 library for Node.js to interact with the SQLite database. The database schema will include tables for storing user details and game events.