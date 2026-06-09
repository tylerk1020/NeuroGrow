import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# -------------------------
# DATABASE URL
#
# LOCAL DEVELOPMENT (default): SQLite — zero setup, just works.
#   neurogrow.db file will be created automatically in your project folder.
#
# PRODUCTION (PostgreSQL): Set DATABASE_URL in your .env file.
#   Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
#
#   Free PostgreSQL options for a high schooler:
#   - Supabase (supabase.com) — best free tier, great UI
#   - Railway (railway.app) — super easy to set up
#   - Render (render.com) — free PostgreSQL included
#
#   Example .env entry:
#   DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/neurogrow
# -------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./neurogrow.db")

# SQLite needs check_same_thread=False. PostgreSQL does NOT want this arg.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # For PostgreSQL on some cloud platforms (like Heroku/Railway),
    # the URL starts with "postgres://" but SQLAlchemy needs "postgresql://"
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency that opens a DB session per request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
